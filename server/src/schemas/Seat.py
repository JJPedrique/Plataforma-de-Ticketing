from pydantic import BaseModel, ConfigDict, Field

class SeatBase(BaseModel):
    row_label: str | None = Field(default=None, max_length=20)
    seat_number: str | None = Field(default=None, max_length=20)
    coord_x: int | None = Field(default=None, ge=0)
    coord_y: int | None = Field(default=None, ge=0)
    is_active: bool = Field(default=True)


class SeatCreate(SeatBase):
    zone_id: int = Field(..., gt=0)


class SeatUpdate(BaseModel):
    zone_id: int | None = Field(default=None, gt=0)
    row_label: str | None = Field(default=None, max_length=20)
    seat_number: str | None = Field(default=None, max_length=20)
    coord_x: int | None = Field(default=None, ge=0)
    coord_y: int | None = Field(default=None, ge=0)
    is_active: bool | None = None


class SeatResponse(SeatBase):
    id: int
    zone_id: int
    
    model_config = ConfigDict(from_attributes=True)

###

class SeatAvailable(SeatBase):
    id: int
    is_available : bool
    model_config = ConfigDict(from_attributes=True)
