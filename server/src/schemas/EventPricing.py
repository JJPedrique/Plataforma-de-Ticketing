from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class EventPricingBase(BaseModel):
    price: Decimal = Field(..., ge=0, max_digits=10, decimal_places=2)


class EventPricingCreate(EventPricingBase):
    event_id: int = Field(..., gt=0)
    zone_id: int = Field(..., gt=0)


class EventPricingUpdate(BaseModel):
    event_id: int | None = Field(default=None, gt=0)
    zone_id: int | None = Field(default=None, gt=0)
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)


class EventPricingResponse(EventPricingBase):
    id: int
    event_id: int
    zone_id: int

    model_config = ConfigDict(from_attributes=True)


class EventZonePriceDetail(EventPricingBase):
    id: int
    event_id: int
    zone_id: int
    name: str | None = Field(default=None, max_length=100)
    color_code: str | None = Field(default=None, max_length=20)
    is_active: bool = True
    seat_count: int = 0
    has_tickets: bool = False

    model_config = ConfigDict(from_attributes=True)


class EventZonePriceCreate(BaseModel):
    event_id: int = Field(..., gt=0)
    name: str = Field(..., min_length=1, max_length=100)
    color_code: str | None = Field(
        default=None,
        max_length=20,
        pattern=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    )
    is_active: bool = True
    seat_count: int = Field(default=0, ge=0, le=500)
    price: Decimal = Field(..., ge=0, max_digits=10, decimal_places=2)


class EventZonePriceUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    color_code: str | None = Field(
        default=None,
        max_length=20,
        pattern=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    )
    is_active: bool | None = None
    seat_count: int | None = Field(default=None, ge=0, le=500)
    price: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
