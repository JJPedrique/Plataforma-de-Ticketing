from fastapi import APIRouter
from src.schemas.PayMethod import *

router = APIRouter(tags=["PayMethods"])

@router.get('/pays')
def get_payMethods():
    pass

@router.post('/pays')
def create_payMethod(payMethod: PayMethodCreate):
    pass

@router.put('/pays/{payMethod_id}')
def update_payMethod(payMethod_id: int, payMethod: PayMethodUpdate):
    pass

@router.delete('/pays/{payMethod_id}')
def update_payMethod(payMethod_id: int):
    pass