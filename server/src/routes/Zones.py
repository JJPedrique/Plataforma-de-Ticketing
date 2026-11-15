from fastapi import APIRouter
from src.schemas.Zone import *

router = APIRouter(tags=["Zones"])

@router.get('/zones')
def get_zones():
    pass

@router.post('/zones')
def create_zone(zone: ZoneCreate):
    pass

@router.put('/zones/{zone_id}')
def update_zone(zone_id: int, zone: ZoneUpdate):
    pass

@router.delete('/zones/{zone_id}')
def update_zone(zone_id: int):
    pass