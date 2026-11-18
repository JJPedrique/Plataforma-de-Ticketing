from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.models.EventPricing import EventPricing
    from src.models.Seat import Seat
    from src.models.Venue import Venue

class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id"), nullable=False, index=True
    )
    name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    color_code: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relaciones
    venue: Mapped["Venue"] = relationship("Venue", back_populates="zones")
    seats: Mapped[List["Seat"]] = relationship("Seat", back_populates="zone")
    event_pricings: Mapped[List["EventPricing"]] = relationship(
        "EventPricing", back_populates="zone"
    )
