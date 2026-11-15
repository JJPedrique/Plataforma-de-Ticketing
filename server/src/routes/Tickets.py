from fastapi import APIRouter
from src.schemas.Ticket import *

router = APIRouter(tags=["Tickets"])

@router.get('/tickets')
def get_tickets():
    pass

@router.post('/tickets')
def create_ticket(ticket: TicketCreate):
    pass

@router.put('/tickets/{ticket_id}')
def update_ticket(ticket_id: int, ticket: TicketUpdate):
    pass

@router.delete('/ticket/{ticket_id}')
def update_ticket(ticket_id: int):
    pass