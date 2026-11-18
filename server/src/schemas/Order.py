from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field

from src.models.Order import OrderStatus


class OrderBase(BaseModel):
    total_amount: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    pay_methods_ref: str | None = Field(default=None, max_length=255)


class OrderCreate(OrderBase):
    user_id: int = Field(..., gt=0)
    pay_method_id: int | None = Field(default=None, gt=0)


class OrderUpdate(BaseModel):
    total_amount: Decimal | None = Field(
        default=None, ge=0, max_digits=10, decimal_places=2
    )
    status: OrderStatus | None = None
    pay_method_id: int | None = Field(default=None, gt=0)
    pay_methods_ref: str | None = Field(default=None, max_length=255)


class OrderResponse(OrderBase):
    id: int
    user_id: int
    pay_method_id: int | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)