from fastapi import APIRouter
from src.schemas.Venue import *

router = APIRouter(tags=["Venues"])

@router.get('/venues')
def get_venues():
    pass

@router.post('/venues')
def create_venue(venue: VenueCreate):
    pass

@router.put('/venues/{venue_id}')
def update_venue(venue_id: int, venue: VenueUpdate):
    pass

@router.delete('/venues/{venue_id}')
def update_venue(venue_id: int):
    pass