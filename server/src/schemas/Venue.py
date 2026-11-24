from pydantic import BaseModel, ConfigDict, Field

from src.models.Zone import Zone
from src.schemas.validation import (
    VENUE_ADDRESS_MAX_LENGTH,
    VENUE_CITY_MAX_LENGTH,
    VENUE_IMG_URL_MAX_LENGTH,
    VENUE_NAME_MAX_LENGTH,
)


class VenueBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=VENUE_NAME_MAX_LENGTH)
    address: str | None = Field(default=None, max_length=VENUE_ADDRESS_MAX_LENGTH)
    city: str | None = Field(default=None, max_length=VENUE_CITY_MAX_LENGTH)
    img_url: str | None = Field(default=None, max_length=VENUE_IMG_URL_MAX_LENGTH)
    is_active: bool = Field(default=True)


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=VENUE_NAME_MAX_LENGTH)
    address: str | None = Field(default=None, max_length=VENUE_ADDRESS_MAX_LENGTH)
    city: str | None = Field(default=None, max_length=VENUE_CITY_MAX_LENGTH)
    img_url: str | None = Field(default=None, max_length=VENUE_IMG_URL_MAX_LENGTH)
    is_active: bool | None = None


class VenueResponse(VenueBase):
    id: int

    model_config = ConfigDict(from_attributes=True)