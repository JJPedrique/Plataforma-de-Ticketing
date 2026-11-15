from datetime import datetime
from decimal import Decimal
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class OrderStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class OrderBase(BaseModel):
    total_amount: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    PayMethods_ref: str | None = Field(default=None, max_length=150)


class OrderCreate(OrderBase):
    user_id: int = Field(..., gt=0)
    payMethod_id: int = Field(..., gt=0)


class OrderUpdate(BaseModel):
    total_amount: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    status: OrderStatus | None = None
    payMethod_id: int | None = Field(default=None, gt=0)
    PayMethods_ref: str | None = Field(default=None, max_length=150)


class OrderResponse(OrderBase):
    id: int
    user_id: int
    payMethod_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)