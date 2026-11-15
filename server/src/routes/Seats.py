from fastapi import APIRouter
from src.schemas.Seat import *

router = APIRouter(tags=["Seats"])

@router.get('/seats')
def get_seats():
    pass

@router.post('/seats')
def create_seat(seat: SeatCreate ):
    pass

@router.put('/seats/{seat_id}')
def update_seat(seat_id: int, seat: SeatUpdate):
    pass

@router.delete('/seats/{seat_id}')
def update_seat(seat_id: int):
    pass