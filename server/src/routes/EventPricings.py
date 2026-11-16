from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import EventPricing
from src.schemas.EventPricing import *

router = APIRouter(tags=["Event Pricings"])

@router.get('/EventPricings', response_model=list[EventPricingResponse])
def get_EventPricings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(EventPricing).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/EventPricings')
def create_EventPricing(EventPricing: EventPricingCreate, db: Session = Depends(get_db)):
    db_EventPricing = EventPricing(**EventPricing.model_dump())
    db.add(db_EventPricing)
    db.commit()
    db.refresh(db_EventPricing)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_EventPricing

@router.put("/EventPricings/{EventPricing_id}", response_model=EventPricingResponse)
def update_EventPricing(EventPricing_id: int, EventPricing: EventPricingUpdate, db: Session = Depends(get_db)):
    db_EventPricing = db.get(EventPricing, EventPricing_id)
    if not db_EventPricing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"EventPricingo con id {EventPricing_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = EventPricing.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_EventPricing, key, value)

    db.commit()
    db.refresh(db_EventPricing)
    return db_EventPricing

@router.delete("/EventPricings/{EventPricing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_EventPricing(EventPricing_id: int, db: Session = Depends(get_db)):
    db_EventPricing = db.get(EventPricing, EventPricing_id)
    if not db_EventPricing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"EventPricingo con id {EventPricing_id} no encontrado",
        )

    db.delete(db_EventPricing)
    db.commit()
    return None