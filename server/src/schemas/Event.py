from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class EventBase(BaseModel):
    organizer_id: int = Field(..., gt=0)
    venue_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool = Field(default=True)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValueError("end_date debe ser posterior a start_date")
        return self


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    organizer_id: int | None = Field(default=None, gt=0)
    venue_id: int | None = Field(default=None, gt=0)
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValueError("end_date debe ser posterior a start_date")
        return self


class EventResponse(EventBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
