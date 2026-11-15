from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, Field


class RoleType(str, Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    CUSTOMER = "customer"


class UserBase(BaseModel):
    email: str = Field(..., max_length=255)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    role: RoleType = Field(default=RoleType.CUSTOMER)
    is_Active: bool = Field(default=True)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserUpdate(BaseModel):
    email: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    role: RoleType | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    is_Active: bool | None = None


class UserResponse(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)