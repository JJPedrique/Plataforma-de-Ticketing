from pydantic import BaseModel, ConfigDict, Field

from src.schemas.validation import (
    PAY_METHOD_DESCRIPTION_MAX_LENGTH,
    PAY_METHOD_NAME_MAX_LENGTH,
)


class PayMethodBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=PAY_METHOD_NAME_MAX_LENGTH)
    description: str | None = Field(default=None, max_length=PAY_METHOD_DESCRIPTION_MAX_LENGTH)
    is_active: bool = Field(default=True)


class PayMethodStatusUpdate(BaseModel):
    is_active: bool


class PayMethodResponse(PayMethodBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
