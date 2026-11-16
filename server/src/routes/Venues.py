from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import Venue
from src.schemas.Venue import *

router = APIRouter(tags=["Venues"])

@router.get('/Venues', response_model=list[VenueResponse])
def get_Venues(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Venue).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Venues')
def create_Venue(Venue: VenueCreate, db: Session = Depends(get_db)):
    db_Venue = Venue(**Venue.model_dump())
    db.add(db_Venue)
    db.commit()
    db.refresh(db_Venue)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Venue

@router.put("/Venues/{Venue_id}", response_model=VenueResponse)
def update_Venue(Venue_id: int, Venue: VenueUpdate, db: Session = Depends(get_db)):
    db_Venue = db.get(Venue, Venue_id)
    if not db_Venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Venueo con id {Venue_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Venue.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Venue, key, value)

    db.commit()
    db.refresh(db_Venue)
    return db_Venue

@router.delete("/Venues/{Venue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Venue(Venue_id: int, db: Session = Depends(get_db)):
    db_Venue = db.get(Venue, Venue_id)
    if not db_Venue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Venueo con id {Venue_id} no encontrado",
        )

    db.delete(db_Venue)
    db.commit()
    return None