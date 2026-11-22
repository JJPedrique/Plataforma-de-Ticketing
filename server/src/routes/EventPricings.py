from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.Event import Event
from src.models.EventPricing import EventPricing
from src.models.Zone import Zone
from src.schemas.EventPricing import (
    EventPricingCreate,
    EventPricingResponse,
    EventPricingUpdate,
    EventZonePriceCreate,
    EventZonePriceDetail,
    EventZonePriceUpdate,
)

router = APIRouter(tags=["Event Pricings"])


def _get_pricing_or_404(pricing_id: int, db: Session) -> EventPricing:
    pricing = db.get(EventPricing, pricing_id)
    if not pricing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Precio no encontrado.")
    return pricing


def _validate_event_zone(db: Session, event_id: int, zone_id: int, exclude_pricing_id: int | None = None) -> None:
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado.")

    zone = db.get(Zone, zone_id)
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Zona no encontrada.")

    if zone.venue_id != event.venue_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La zona seleccionada no pertenece al lugar del evento.",
        )

    stmt = select(EventPricing.id).where(
        EventPricing.event_id == event_id,
        EventPricing.zone_id == zone_id,
    )
    if exclude_pricing_id is not None:
        stmt = stmt.where(EventPricing.id != exclude_pricing_id)

    if db.scalar(stmt) is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un precio para esa zona en este evento.",
        )


def _zone_name_taken(db: Session, event_id: int, name: str | None, exclude_pricing_id: int | None = None) -> bool:
    if not name:
        return False
    stmt = (
        select(EventPricing.id)
        .join(Zone, EventPricing.zone_id == Zone.id)
        .where(
            EventPricing.event_id == event_id,
            func.lower(Zone.name) == name.strip().lower(),
        )
    )
    if exclude_pricing_id is not None:
        stmt = stmt.where(EventPricing.id != exclude_pricing_id)
    return db.scalar(stmt) is not None


def _to_detail(pricing: EventPricing, zone: Zone) -> dict:
    return {
        "id": pricing.id,
        "event_id": pricing.event_id,
        "zone_id": pricing.zone_id,
        "name": zone.name,
        "color_code": zone.color_code,
        "is_active": zone.is_active,
        "price": pricing.price,
    }


@router.get('/EventZonePrices', response_model=list[EventZonePriceDetail])
def get_event_zone_prices(event_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(EventPricing, Zone).join(Zone, EventPricing.zone_id == Zone.id)
    if event_id is not None:
        stmt = stmt.where(EventPricing.event_id == event_id)
    stmt = stmt.offset(skip).limit(limit)
    return [_to_detail(pricing, zone) for pricing, zone in db.execute(stmt).all()]


@router.post('/EventZonePrices', response_model=EventZonePriceDetail, status_code=status.HTTP_201_CREATED)
def create_event_zone_price(payload: EventZonePriceCreate, db: Session = Depends(get_db)):
    event = db.get(Event, payload.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado.")

    if _zone_name_taken(db, event.id, payload.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una zona con ese nombre en este evento.",
        )

    zone = Zone(
        venue_id=event.venue_id,
        name=payload.name.strip(),
        color_code=payload.color_code,
        is_active=payload.is_active,
    )
    db.add(zone)
    db.flush()

    pricing = EventPricing(event_id=event.id, zone_id=zone.id, price=payload.price)
    db.add(pricing)
    db.commit()
    db.refresh(pricing)
    db.refresh(zone)
    return _to_detail(pricing, zone)


@router.put('/EventZonePrices/{pricing_id}', response_model=EventZonePriceDetail)
def update_event_zone_price(pricing_id: int, payload: EventZonePriceUpdate, db: Session = Depends(get_db)):
    pricing = _get_pricing_or_404(pricing_id, db)
    zone = db.get(Zone, pricing.zone_id)
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Zona no encontrada.")

    data = payload.model_dump(exclude_unset=True)
    if "name" in data and _zone_name_taken(db, pricing.event_id, data["name"], exclude_pricing_id=pricing.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una zona con ese nombre en este evento.",
        )

    for field in ("name", "color_code", "is_active"):
        if field in data:
            setattr(zone, field, data[field])
    if "price" in data:
        pricing.price = data["price"]

    db.commit()
    db.refresh(pricing)
    db.refresh(zone)
    return _to_detail(pricing, zone)


@router.delete('/EventZonePrices/{pricing_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_event_zone_price(pricing_id: int, db: Session = Depends(get_db)):
    pricing = _get_pricing_or_404(pricing_id, db)
    zone_id = pricing.zone_id

    db.delete(pricing)
    db.flush()

    still_used = db.scalar(select(EventPricing.id).where(EventPricing.zone_id == zone_id))
    if still_used is None:
        zone = db.get(Zone, zone_id)
        if zone:
            zone.is_active = False

    db.commit()
    return None


@router.get('/EventPricings', response_model=list[EventPricingResponse])
def get_EventPricings(event_id: int | None = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(EventPricing)
    if event_id is not None:
        stmt = stmt.where(EventPricing.event_id == event_id)
    stmt = stmt.offset(skip).limit(limit)
    return db.scalars(stmt).all()


@router.post('/EventPricings', response_model=EventPricingResponse, status_code=status.HTTP_201_CREATED)
def create_EventPricing(payload: EventPricingCreate, db: Session = Depends(get_db)):
    _validate_event_zone(db, payload.event_id, payload.zone_id)

    db_pricing = EventPricing(**payload.model_dump())
    db.add(db_pricing)
    db.commit()
    db.refresh(db_pricing)
    return db_pricing


@router.put("/EventPricings/{EventPricing_id}", response_model=EventPricingResponse)
def update_EventPricing(EventPricing_id: int, payload: EventPricingUpdate, db: Session = Depends(get_db)):
    db_pricing = _get_pricing_or_404(EventPricing_id, db)

    update_data = payload.model_dump(exclude_unset=True)
    final_event_id = update_data.get("event_id", db_pricing.event_id)
    final_zone_id = update_data.get("zone_id", db_pricing.zone_id)

    if "event_id" in update_data or "zone_id" in update_data:
        _validate_event_zone(db, final_event_id, final_zone_id, exclude_pricing_id=db_pricing.id)

    for key, value in update_data.items():
        setattr(db_pricing, key, value)

    db.commit()
    db.refresh(db_pricing)
    return db_pricing


@router.delete("/EventPricings/{EventPricing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_EventPricing(EventPricing_id: int, db: Session = Depends(get_db)):
    db_pricing = _get_pricing_or_404(EventPricing_id, db)
    db.delete(db_pricing)
    db.commit()
    return None
