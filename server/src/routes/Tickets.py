from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from src.models.Event import Event
from src.models.Ticket import Ticket
from src.schemas.Ticket import *
from src.messages import not_found
from src.pagination import PaginationParams
from src.schemas.validation import EVENT_STATUS_FINISHED, get_event_status

router = APIRouter(tags=["Tickets"])


def ensure_event_is_sellable(db: Session, event_id: int) -> None:
    """Bloquea la venta de eventos ya finalizados (estado derivado de fechas)."""
    event = db.get(Event, event_id)
    if not event:
        return
    if get_event_status(event.start_date, event.end_date) == EVENT_STATUS_FINISHED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este evento ya finalizó y no permite nuevas ventas.",
        )


@router.get('/Tickets', response_model=list[TicketResponse])
def get_Tickets(pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(Ticket).offset(pagination.skip).limit(pagination.limit)
    return db.scalars(stmt).all()

@router.post('/Tickets')
def create_Ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    ensure_event_is_sellable(db, ticket.event_id)
    db_Ticket = Ticket(**ticket.model_dump())
    db.add(db_Ticket)
    db.commit()
    db.refresh(db_Ticket)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Ticket

@router.put("/Tickets/{Ticket_id}", response_model=TicketResponse)
def update_Ticket(Ticket_id: int, Ticket: TicketUpdate, db: Session = Depends(get_db)):
    db_Ticket = db.get(Ticket, Ticket_id)
    if not db_Ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=not_found("Ticket", Ticket_id),
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Ticket.model_dump(exclude_unset=True)
    if "event_id" in update_data:
        ensure_event_is_sellable(db, update_data["event_id"])
    for key, value in update_data.items():
        setattr(db_Ticket, key, value)

    db.commit()
    db.refresh(db_Ticket)
    return db_Ticket

@router.delete("/Tickets/{Ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Ticket(Ticket_id: int, db: Session = Depends(get_db)):
    db_Ticket = db.get(Ticket, Ticket_id)
    if not db_Ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=not_found("Ticket", Ticket_id),
        )

    db.delete(db_Ticket)
    db.commit()
    return None

@router.post('/BookTicket')
def book_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    ensure_event_is_sellable(db, ticket.event_id)
    is_available = db.scalar(func.is_seat_available(ticket.event_id, ticket.seat_id, ticket.order_id))
    if not is_available: return None

    db_Ticket = Ticket(**ticket.model_dump())
    db.add(db_Ticket)
    db.commit()
    db.refresh(db_Ticket)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Ticket