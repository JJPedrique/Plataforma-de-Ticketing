from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.Ticket import Ticket
from src.schemas.Ticket import *

router = APIRouter(tags=["Tickets"])

@router.get('/Tickets', response_model=list[TicketResponse])
def get_Tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Ticket).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Tickets')
def create_Ticket(Ticket: TicketCreate, db: Session = Depends(get_db)):
    db_Ticket = Ticket(**Ticket.model_dump())
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
            detail=f"Ticketo con id {Ticket_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Ticket.model_dump(exclude_unset=True)
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
            detail=f"Ticketo con id {Ticket_id} no encontrado",
        )

    db.delete(db_Ticket)
    db.commit()
    return None