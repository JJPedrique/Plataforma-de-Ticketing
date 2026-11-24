from decimal import Decimal
from typing import List

from pydantic import BaseModel, ConfigDict, Field

from src.schemas.Seat import SeatAvailable
from src.schemas.validation import (
    COLOR_CODE_MAX_LENGTH,
    HEX_COLOR_PATTERN,
    ZONE_NAME_MAX_LENGTH,
)


class ZoneBase(BaseModel):
    name: str | None = Field(default=None, max_length=ZONE_NAME_MAX_LENGTH)
    color_code: str | None = Field(
        default=None,
        max_length=COLOR_CODE_MAX_LENGTH,
        pattern=HEX_COLOR_PATTERN,
    )
    is_active: bool = Field(default=True)


class ZoneCreate(ZoneBase):
    venue_id: int = Field(..., gt=0)


class ZoneUpdate(BaseModel):
    venue_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, max_length=ZONE_NAME_MAX_LENGTH)
    color_code: str | None = Field(
        default=None,
        max_length=COLOR_CODE_MAX_LENGTH,
        pattern=HEX_COLOR_PATTERN,
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