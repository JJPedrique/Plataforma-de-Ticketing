from fastapi import APIRouter
from src.schemas.Order import *

router = APIRouter(tags=["Orders"])

@router.get('/orders')
def get_orders():
    pass

@router.post('/orders')
def create_order(order: OrderCreate):
    pass

@router.put('/orders/{order_id}')
def update_order(order_id: int, order: OrderUpdate):
    pass

@router.delete('/orders/{order_id}')
def update_order(order_id: int):
    pass