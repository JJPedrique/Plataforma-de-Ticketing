import enum
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.models.PayMethod import PayMethod
    from src.models.Ticket import Ticket
    from src.models.User import User


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), nullable=False, index=True
    )
    total_amount: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status"),
        default=OrderStatus.PENDING,
        nullable=False,
    )
    # Si en PostgreSQL las columnas se crearon literalmente con mayúsculas como en el diagrama,
    # pasa el nombre exacto como primer argumento: mapped_column("payMethod_id", ...)
    pay_method_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("pay_methods.id"), nullable=True, index=True
    )
    pay_methods_ref: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="orders")
    pay_method: Mapped[Optional["PayMethod"]] = relationship(
        "PayMethod", back_populates="orders"
    )
    tickets: Mapped[List["Ticket"]] = relationship(
        "Ticket", back_populates="order"
    )