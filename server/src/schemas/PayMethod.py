from pydantic import BaseModel, ConfigDict, Field


class PayMethodBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    is_active: bool = Field(default=True)


class PayMethodCreate(PayMethodBase):
    pass


class PayMethodUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=255)
    is_active: bool | None = None


class PayMethodResponse(PayMethodBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
