from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.models.EventPricing import EventPricing
    from src.models.Ticket import Ticket
    from src.models.User import User
    from src.models.Venue import Venue


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    end_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relaciones
    organizer: Mapped["User"] = relationship(
        "User", back_populates="organized_events"
    )
    venue: Mapped["Venue"] = relationship("Venue", back_populates="events")
    pricings: Mapped[List["EventPricing"]] = relationship(
        "EventPricing", back_populates="event"
    )
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="event")