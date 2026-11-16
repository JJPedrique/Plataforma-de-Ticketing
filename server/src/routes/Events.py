from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.Event import Event
from src.schemas.Event import EventCreate, EventResponse, EventUpdate

router = APIRouter(tags=["Events"])


@router.get('/Events', response_model=list[EventResponse])
def get_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Event).offset(skip).limit(limit)
    return db.scalars(stmt).all()


@router.get('/Events/{event_id}', response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado.")
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado.")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(db_event, key, value)

    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete('/Events/{event_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.get(Event, event_id)
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado.")

    try:
        db.delete(db_event)
        db.commit()
    except Exception:
        db.rollback()
        db_event.is_active = False
        db.commit()
    return None
