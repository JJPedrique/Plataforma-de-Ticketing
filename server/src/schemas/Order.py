from datetime import datetime
from decimal import Decimal
from typing import List, Optional
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


class PurchasedSeatSchema(BaseModel):
    ticket_id: int
    zone_name: str
    zone_color: Optional[str] = None
    row_label: str
    seat_number: str
    price: Optional[Decimal] = None


class PurchaseHistorySchema(BaseModel):
    order_id: int
    total_amount: Decimal
    completed_at: datetime
    payment_method: str
    payment_reference: Optional[str] = None
    event_id: int
    event_title: str
    event_description: Optional[str] = None
    event_start_date: datetime
    event_end_date: datetime
    venue_name: str
    venue_address: Optional[str] = None
    venue_city: Optional[str] = None
    venue_img_url: Optional[str] = None
    tickets: List[PurchasedSeatSchema]