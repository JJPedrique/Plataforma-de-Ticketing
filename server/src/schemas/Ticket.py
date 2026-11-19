from pydantic import BaseModel, ConfigDict, Field


class TicketBase(BaseModel):
    event_id: int = Field(..., gt=0)
    order_id: int = Field(..., gt=0)
    seat_id: int = Field(..., gt=0)


class TicketCreate(TicketBase):
    pass


class TicketUpdate(BaseModel):
    event_id: int | None = Field(default=None, gt=0)
    order_id: int | None = Field(default=None, gt=0)
    seat_id: int | None = Field(default=None, gt=0)


class TicketResponse(TicketBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
