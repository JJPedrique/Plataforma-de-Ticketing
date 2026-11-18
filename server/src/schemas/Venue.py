from pydantic import BaseModel, ConfigDict, Field

from src.models.Zone import Zone


class VenueBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    address: str | None = None
    city: str | None = Field(default=None, max_length=100)
    img_url: str | None = Field(default=None, max_length=500)
    is_active: bool = Field(default=True)


class VenueCreate(VenueBase):
    pass


class VenueUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    address: str | None = None
    city: str | None = Field(default=None, max_length=100)
    img_url: str | None = Field(default=None, max_length=500)
    is_active: bool | None = None


class VenueResponse(VenueBase):
    id: int

    model_config = ConfigDict(from_attributes=True)