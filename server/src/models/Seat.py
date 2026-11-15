from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.models.Ticket import Ticket
    from src.models.Zone import Zone


class Seat(Base):
    __tablename__ = "seats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    zone_id: Mapped[int] = mapped_column(
        ForeignKey("zones.id"), nullable=False, index=True
    )
    row_label: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    seat_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    coord_x: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    coord_y: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relaciones
    zone: Mapped["Zone"] = relationship("Zone", back_populates="seats")
    tickets: Mapped[List["Ticket"]] = relationship("Ticket", back_populates="seat")