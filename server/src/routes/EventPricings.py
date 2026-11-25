import math

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.Event import Event
from src.models.EventPricing import EventPricing
from src.models.Order import Order, OrderStatus
from src.models.Seat import Seat
from src.models.Ticket import Ticket
from src.models.Zone import Zone
from src.schemas.EventPricing import (
    EventPricingCreate,
    EventPricingResponse,
    EventPricingUpdate,
    EventZonePriceCreate,
    EventZonePriceDetail,
    EventZonePriceUpdate,
)
from src.messages import not_found
from src.pagination import PaginationParams

router = APIRouter(tags=["Event Pricings"])


def _get_pricing_or_404(pricing_id: int, db: Session) -> EventPricing:
    pricing = db.get(EventPricing, pricing_id)
    if not pricing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Precio"),)
    return pricing


def _validate_event_zone(db: Session, event_id: int, zone_id: int, exclude_pricing_id: int | None = None) -> None:
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Evento"),)

    zone = db.get(Zone, zone_id)
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Zona", feminine=True),)

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


ACTIVE_ORDER_STATUSES = (OrderStatus.PENDING, OrderStatus.COMPLETED)


def _row_label(index: int) -> str:
    label = ""
    number = index + 1
    while number:
        number, remainder = divmod(number - 1, 26)
        label = chr(65 + remainder) + label
    return label


def _auto_columns(count: int) -> int:
    if count <= 0:
        return 1
    return min(12, max(1, math.ceil(math.sqrt(count))))


def _active_seats(db: Session, zone_id: int) -> list[Seat]:
    return db.scalars(
        select(Seat)
        .where(Seat.zone_id == zone_id, Seat.is_active.is_(True))
        .order_by(Seat.coord_y, Seat.coord_x, Seat.id)
    ).all()


def _protected_seat_ids(db: Session, seat_ids: list[int]) -> set[int]:
    if not seat_ids:
        return set()
    return set(db.scalars(
        select(Ticket.seat_id)
        .join(Order, Ticket.order_id == Order.id)
        .where(
            Ticket.seat_id.in_(seat_ids),
            Order.status.in_(ACTIVE_ORDER_STATUSES),
        )
    ).all())


def _zone_has_tickets(db: Session, zone_id: int) -> bool:
    seat_ids = select(Seat.id).where(Seat.zone_id == zone_id)
    stmt = (
        select(Ticket.id)
        .join(Order, Ticket.order_id == Order.id)
        .where(
            Ticket.seat_id.in_(seat_ids),
            Order.status.in_(ACTIVE_ORDER_STATUSES),
        )
    )
    return db.scalar(stmt) is not None


def _seat_count(db: Session, zone_id: int) -> int:
    return db.scalar(
        select(func.count(Seat.id)).where(
            Seat.zone_id == zone_id,
            Seat.is_active.is_(True),
        )
    ) or 0


def _set_seat_count(db: Session, zone_id: int, desired: int) -> None:
    active = _active_seats(db, zone_id)
    current = len(active)
    if desired == current:
        return

    if desired < current:
        protected = _protected_seat_ids(db, [seat.id for seat in active])
        to_remove = []
        for seat in reversed(active):
            if seat.id in protected:
                break
            to_remove.append(seat)
            if len(to_remove) == current - desired:
                break
        if len(to_remove) < current - desired:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No se puede reducir: las últimas sillas tienen reservas o ventas.",
            )
        for seat in to_remove:
            seat.is_active = False
        return

    need = desired - current
    inactive = db.scalars(
        select(Seat)
        .where(Seat.zone_id == zone_id, Seat.is_active.is_(False))
        .order_by(Seat.coord_y, Seat.coord_x, Seat.id)
    ).all()

    for seat in inactive[:need]:
        seat.is_active = True
        active.append(seat)
        need -= 1

    if need <= 0:
        return

    active.sort(key=lambda seat: (seat.coord_y or 0, seat.coord_x or 0, seat.id))
    if active:
        columns = max((seat.coord_x or 0) for seat in active) + 1
        last = active[-1]
        next_col = (last.coord_x or 0) + 1
        next_row = last.coord_y or 0
    else:
        columns = _auto_columns(desired)
        next_col = 0
        next_row = 0

    for _ in range(need):
        if next_col >= columns:
            next_col = 0
            next_row += 1
        db.add(Seat(
            zone_id=zone_id,
            row_label=_row_label(next_row),
            seat_number=str(next_col + 1),
            coord_x=next_col,
            coord_y=next_row,
            is_active=True,
        ))
        next_col += 1


def _to_detail(pricing: EventPricing, zone: Zone, db: Session) -> dict:
    return {
        "id": pricing.id,
        "event_id": pricing.event_id,
        "zone_id": pricing.zone_id,
        "name": zone.name,
        "color_code": zone.color_code,
        "is_active": zone.is_active,
        "seat_count": _seat_count(db, zone.id),
        "has_tickets": _zone_has_tickets(db, zone.id),
        "price": pricing.price,
    }


@router.get('/EventZonePrices', response_model=list[EventZonePriceDetail])
def get_event_zone_prices(event_id: int | None = None, pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(EventPricing, Zone).join(Zone, EventPricing.zone_id == Zone.id)
    if event_id is not None:
        stmt = stmt.where(EventPricing.event_id == event_id)
    stmt = stmt.offset(pagination.skip).limit(pagination.limit)
    return [_to_detail(pricing, zone, db) for pricing, zone in db.execute(stmt).all()]


@router.post('/EventZonePrices', response_model=EventZonePriceDetail, status_code=status.HTTP_201_CREATED)
def create_event_zone_price(payload: EventZonePriceCreate, db: Session = Depends(get_db)):
    event = db.get(Event, payload.event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Evento"),)

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
    _set_seat_count(db, zone.id, payload.seat_count)

    pricing = EventPricing(event_id=event.id, zone_id=zone.id, price=payload.price)
    db.add(pricing)
    db.commit()
    db.refresh(pricing)
    db.refresh(zone)
    return _to_detail(pricing, zone, db)


@router.put('/EventZonePrices/{pricing_id}', response_model=EventZonePriceDetail)
def update_event_zone_price(pricing_id: int, payload: EventZonePriceUpdate, db: Session = Depends(get_db)):
    pricing = _get_pricing_or_404(pricing_id, db)
    zone = db.get(Zone, pricing.zone_id)
    if not zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Zona", feminine=True),)

    data = payload.model_dump(exclude_unset=True)

    if _zone_has_tickets(db, zone.id):
        blocked = []
        if "price" in data and data["price"] != pricing.price:
            blocked.append("el precio")
        if "seat_count" in data and data["seat_count"] != _seat_count(db, zone.id):
            blocked.append("las sillas")
        if data.get("is_active") is False and bool(zone.is_active):
            blocked.append("el estado")
        if blocked:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"La zona tiene reservas o ventas activas; no se puede cambiar {', '.join(blocked)}.",
            )

    if "name" in data and _zone_name_taken(db, pricing.event_id, data["name"], exclude_pricing_id=pricing.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una zona con ese nombre en este evento.",
        )

    if "seat_count" in data:
        _set_seat_count(db, zone.id, data["seat_count"])

    for field in ("name", "color_code", "is_active"):
        if field in data:
            setattr(zone, field, data[field])
    if "price" in data:
        pricing.price = data["price"]

    db.commit()
    db.refresh(pricing)
    db.refresh(zone)
    return _to_detail(pricing, zone, db)


@router.delete('/EventZonePrices/{pricing_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_event_zone_price(pricing_id: int, db: Session = Depends(get_db)):
    pricing = _get_pricing_or_404(pricing_id, db)

    if _zone_has_tickets(db, pricing.zone_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No se puede desactivar: la zona tiene reservas o ventas activas.",
        )

    zone = db.get(Zone, pricing.zone_id)
    if zone:
        zone.is_active = False

    db.commit()
    return None


@router.get('/EventPricings', response_model=list[EventPricingResponse])
def get_EventPricings(event_id: int | None = None, pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(EventPricing)
    if event_id is not None:
        stmt = stmt.where(EventPricing.event_id == event_id)
    stmt = stmt.offset(pagination.skip).limit(pagination.limit)
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
