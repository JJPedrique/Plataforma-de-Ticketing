from datetime import datetime
from pydantic import BaseModel, ConfigDict

class EventBase(BaseModel):
    id: int
    organizer_id: int
    venue_id: int
    title: str
    description: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    is_active: bool | None = None

class EventResponse(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)