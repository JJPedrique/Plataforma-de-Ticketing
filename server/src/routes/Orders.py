from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.Order import Order
from src.schemas.Order import *

router = APIRouter(tags=["Orders"])

@router.get('/Orders', response_model=list[OrderResponse])
def get_Orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Order).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Orders')
def create_Order(Order: OrderCreate, db: Session = Depends(get_db)):
    db_Order = Order(**Order.model_dump())
    db.add(db_Order)
    db.commit()
    db.refresh(db_Order)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Order

@router.put("/Orders/{Order_id}", response_model=OrderResponse)
def update_Order(Order_id: int, Order: OrderUpdate, db: Session = Depends(get_db)):
    db_Order = db.get(Order, Order_id)
    if not db_Order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordero con id {Order_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Order.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Order, key, value)

    db.commit()
    db.refresh(db_Order)
    return db_Order

@router.delete("/Orders/{Order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Order(Order_id: int, db: Session = Depends(get_db)):
    db_Order = db.get(Order, Order_id)
    if not db_Order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordero con id {Order_id} no encontrado",
        )

    db.delete(db_Order)
    db.commit()
    return None