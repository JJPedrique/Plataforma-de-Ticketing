from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, computed_field, model_validator

from src.schemas.Venue import VenueResponse
from src.schemas.validation import (
    EVENT_DESCRIPTION_MAX_LENGTH,
    EVENT_TITLE_MAX_LENGTH,
    get_event_status,
    validate_event_dates,
)


class EventBase(BaseModel):
    organizer_id: int = Field(..., gt=0)
    venue_id: int = Field(..., gt=0)
    title: str = Field(..., min_length=1, max_length=EVENT_TITLE_MAX_LENGTH)
    description: str | None = Field(default=None, max_length=EVENT_DESCRIPTION_MAX_LENGTH)
    start_date: datetime
    end_date: datetime
    is_active: bool = Field(default=True)

    @model_validator(mode="after")
    def validate_dates(self):
        validate_event_dates(self.start_date, self.end_date, allow_past=True)
        return self


class EventStatusMixin(BaseModel):
    """Estado derivado de las fechas; solo en respuestas, nunca en payloads."""

    @computed_field
    @property
    def status(self) -> str:
        return get_event_status(self.start_date, self.end_date)


class EventCreate(EventBase):
    @model_validator(mode="after")
    def validate_future_start(self):
        validate_event_dates(self.start_date, self.end_date, allow_past=False)
        return self


class EventUpdate(BaseModel):
    organizer_id: int | None = Field(default=None, gt=0)
    venue_id: int | None = Field(default=None, gt=0)
    title: str | None = Field(default=None, min_length=1, max_length=EVENT_TITLE_MAX_LENGTH)
    description: str | None = Field(default=None, max_length=EVENT_DESCRIPTION_MAX_LENGTH)
    start_date: datetime
    end_date: datetime
    is_active: bool | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        validate_event_dates(self.start_date, self.end_date, allow_past=True)
        return self


class EventResponse(EventStatusMixin, EventBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class EventVenueResponse(EventStatusMixin, EventBase):
    id: int
    venue: VenueResponse
    model_config = ConfigDict(from_attributes=True)
