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