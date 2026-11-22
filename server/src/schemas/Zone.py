from decimal import Decimal
from typing import List

from pydantic import BaseModel, ConfigDict, Field

from src.schemas.Seat import SeatAvailable


class ZoneBase(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    color_code: str | None = Field(
        default=None,
        max_length=20,
        pattern=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    )
    is_active: bool = Field(default=True)


class ZoneCreate(ZoneBase):
    venue_id: int = Field(..., gt=0)


class ZoneUpdate(BaseModel):
    venue_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, max_length=100)
    color_code: str | None = Field(
        default=None,
        max_length=20,
        pattern=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    )
    is_active: bool | None = None


class ZoneResponse(ZoneBase):
    id: int
    venue_id: int

    model_config = ConfigDict(from_attributes=True)

###
class ZoneSeats(ZoneBase):
    id: int
    price: Decimal
    seats: List[SeatAvailable]