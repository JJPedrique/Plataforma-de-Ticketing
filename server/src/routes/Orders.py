import asyncio
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from src.database import SessionLocal, get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.Order import Order
from src.schemas.Order import OrderCreate, OrderResponse, OrderUpdate

router = APIRouter(tags=["Orders"])

@router.get('/Orders', response_model=list[OrderResponse])
def get_Orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Order).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Orders')
def create_Order(background_tasks: BackgroundTasks, order: OrderCreate, db: Session = Depends(get_db)):
    db_Order = Order(**order.model_dump())
    db.add(db_Order)
    db.commit()
    db.refresh(db_Order)  
    background_tasks.add_task(actualizar_fila_diferida,db_Order.id)
    return db_Order

@router.put("/Orders/{Order_id}", response_model=OrderResponse)
def update_Order(Order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_Order = db.get(Order, Order_id)
    if not db_Order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordero con id {Order_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = order.model_dump(exclude_unset=True)
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

async def actualizar_fila_diferida(row_id: int, segundos: int = 60):
    await asyncio.sleep(segundos)

    db = SessionLocal()
    try:
        fila = db.query(Order).filter(Order.id == row_id).first()
        if not fila or fila.status != "PENDING": return
        fila.status = "CANCELLED"
        db.commit()
    finally: db.close()