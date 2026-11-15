from fastapi import APIRouter
from src.schemas.EventPricing import *

router = APIRouter(tags=["Event Princing"])

@router.get('/pricings')
def get_pricings():
    pass

@router.post('/pricings')
def create_pricing(pricing: EventPricingCreate):
    pass

@router.put('/pricings/{pricing_id}')
def update_pricing(pricing_id: int, pricing: EventPricingUpdate):
    pass

@router.delete('/pricings/{pricing_id}')
def update_pricing(pricing_id: int):
    pass