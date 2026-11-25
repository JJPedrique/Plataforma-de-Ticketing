from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session

from src.schemas.Zone import *
from src.models.Zone import Zone
from src.models.EventPricing import EventPricing
from src.models.Seat import Seat
from src.messages import not_found
from src.pagination import PaginationParams

router = APIRouter(tags=["Zones"])


@router.get('/Zones', response_model=list[ZoneResponse])
def get_Zones(venue_id: int | None = None, pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(Zone)
    if venue_id is not None:
        stmt = stmt.where(Zone.venue_id == venue_id)
    stmt = stmt.offset(pagination.skip).limit(pagination.limit)
    return db.scalars(stmt).all()


@router.post('/Zones', response_model=ZoneResponse, status_code=status.HTTP_201_CREATED)
def create_Zone(payload: ZoneCreate, db: Session = Depends(get_db)):
    db_Zone = Zone(**payload.model_dump())
    db.add(db_Zone)
    db.commit()
    db.refresh(db_Zone)
    return db_Zone


@router.put("/Zones/{Zone_id}", response_model=ZoneResponse)
def update_Zone(Zone_id: int, payload: ZoneUpdate, db: Session = Depends(get_db)):
    db_Zone = db.get(Zone, Zone_id)
    if not db_Zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Zona", feminine=True),)

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Zone, key, value)

    db.commit()
    db.refresh(db_Zone)
    return db_Zone


@router.delete("/Zones/{Zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Zone(Zone_id: int, db: Session = Depends(get_db)):
    db_Zone = db.get(Zone, Zone_id)
    if not db_Zone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Zona", feminine=True),)

    try:
        db.delete(db_Zone)
        db.commit()
    except Exception:
        db.rollback()
        db_Zone.is_active = False
        db.commit()
    return None


@router.get("/ZonesPrices")
def get_zones_prices(order_id: int, venue_id: int, event_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(
            Zone,
            EventPricing.price,
            Seat,
            func.is_seat_available(event_id, Seat.id, order_id).label("is_available"),
        )
        .join(EventPricing, EventPricing.zone_id == Zone.id)
        .outerjoin(
            Seat,
            and_(Seat.zone_id == Zone.id, Seat.is_active.is_(True)),
        )
        .where(
            Zone.venue_id == venue_id,
            Zone.is_active.is_(True),
            EventPricing.event_id == event_id,
        )
        .order_by(Zone.id, Seat.id)
    )

    rows = db.execute(stmt).all()

    zones_map = {}

    for zone, price, seat, is_available in rows:
        if zone.id not in zones_map:
            zones_map[zone.id] = {
                "id": zone.id,
                "name": zone.name,
                "color_code": zone.color_code,
                "price": price,
                "seats": []
            }

        if seat is None:
            continue

        zones_map[zone.id]["seats"].append({
            "id": seat.id,
            "row_label": seat.row_label,
            "seat_number": seat.seat_number,
            "coord_x": seat.coord_x,
            "coord_y": seat.coord_y,
            "is_available": is_available
        })

    return list(zones_map.values())
