from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import Seat
from src.schemas.Seat import *

router = APIRouter(tags=["Seats"])

@router.get('/Seats', response_model=list[SeatResponse])
def get_Seats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Seat).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Seats')
def create_Seat(Seat: SeatCreate, db: Session = Depends(get_db)):
    db_Seat = Seat(**Seat.model_dump())
    db.add(db_Seat)
    db.commit()
    db.refresh(db_Seat)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Seat

@router.put("/Seats/{Seat_id}", response_model=SeatResponse)
def update_Seat(Seat_id: int, Seat: SeatUpdate, db: Session = Depends(get_db)):
    db_Seat = db.get(Seat, Seat_id)
    if not db_Seat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Seato con id {Seat_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Seat.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Seat, key, value)

    db.commit()
    db.refresh(db_Seat)
    return db_Seat

@router.delete("/Seats/{Seat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Seat(Seat_id: int, db: Session = Depends(get_db)):
    db_Seat = db.get(Seat, Seat_id)
    if not db_Seat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Seato con id {Seat_id} no encontrado",
        )

    db.delete(db_Seat)
    db.commit()
    return None