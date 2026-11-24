from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from src.database import get_db
from src.models.Event import Event
from src.models.Venue import Venue
from src.schemas.Event import EventCreate, EventResponse, EventUpdate, EventVenueResponse
from src.messages import not_found
from src.pagination import PaginationParams

router = APIRouter(tags=["Events"])

@router.get('/Events', response_model=list[EventResponse])
def get_events(pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(Event).offset(pagination.skip).limit(pagination.limit)
    return db.scalars(stmt).all()


@router.get('/Events/{event_id}', response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Evento"),)
    return event


@router.post('/Events', response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**payload.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.put('/Events/{event_id}', response_model=EventResponse)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db)):
    db_event = db.get(Event, event_id)
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Evento"),)

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete('/Events/{event_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.get(Event, event_id)
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Evento"),)

    try:
        db.delete(db_event)
        db.commit()
    except Exception:
        db.rollback()
        db_event.is_active = False
        db.commit()
    return None

@router.get('/EventsVenues', response_model=list[EventVenueResponse])
def get_events(title = "", pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    # un evento solo es visible si él y su lugar están activos.
    stmt = (
        select(Event)
        .where(
            Event.is_active.is_(True),
            Event.venue.has(Venue.is_active.is_(True)),
            Event.title.ilike(f"%{title}%"),
        )
        .options(joinedload(Event.venue))
        .offset(pagination.skip)
        .limit(pagination.limit)
    )
    return db.scalars(stmt).all()