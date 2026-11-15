from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.models.Event import Event
    from src.models.Order import Order
    from src.models.Seat import Seat

class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"), nullable=False, index=True
    )
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id"), nullable=False, index=True
    )
    seat_id: Mapped[int] = mapped_column(
        ForeignKey("seats.id"), nullable=False, index=True
    )

    # Relaciones
    event: Mapped["Event"] = relationship("Event", back_populates="tickets")
    order: Mapped["Order"] = relationship("Order", back_populates="tickets")
    seat: Mapped["Seat"] = relationship("Seat", back_populates="tickets")