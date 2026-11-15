from fastapi import APIRouter
from src.schemas.Event import *

router = APIRouter(tags=["Events"])

@router.get('/events')
def get_events():
    pass

@router.post('/events')
def create_event(event: EventCreate):
    pass

@router.put('/events/{event_id}')
def update_event(event_id: int, event: EventUpdate):
    pass

@router.delete('/event/{event_id}')
def update_event(event_id: int):
    pass