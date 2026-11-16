from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.Venue import Venue
from src.schemas.Venue import VenueCreate, VenueResponse, VenueUpdate

router = APIRouter(tags=["Venues"])


@router.get('/Venues', response_model=list[VenueResponse])
def get_venues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Venue).offset(skip).limit(limit)
    return db.scalars(stmt).all()


@router.get('/Venues/{venue_id}', response_model=VenueResponse)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    venue = db.get(Venue, venue_id)
    if not venue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lugar no encontrado.")
    return venue


@router.post('/Venues', response_model=VenueResponse, status_code=status.HTTP_201_CREATED)
def create_venue(payload: VenueCreate, db: Session = Depends(get_db)):
    db_venue = Venue(**payload.model_dump())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue


@router.put('/Venues/{venue_id}', response_model=VenueResponse)
def update_venue(venue_id: int, payload: VenueUpdate, db: Session = Depends(get_db)):
    db_venue = db.get(Venue, venue_id)
    if not db_venue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lugar no encontrado.")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(db_venue, key, value)

    db.commit()
    db.refresh(db_venue)
    return db_venue


@router.delete('/Venues/{venue_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_venue(venue_id: int, db: Session = Depends(get_db)):
    db_venue = db.get(Venue, venue_id)
    if not db_venue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lugar no encontrado.")

    try:
        db.delete(db_venue)
        db.commit()
    except Exception:
        db.rollback()
        db_venue.is_active = False
        db.commit()
    return None
