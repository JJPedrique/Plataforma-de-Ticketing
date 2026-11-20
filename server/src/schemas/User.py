from datetime import datetime
from enum import Enum
import re
from pydantic import BaseModel, ConfigDict, Field, field_validator


NAME_REGEX = re.compile(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9' -]+$")


def _validate_person_name(value: str, field_label: str) -> str:
    if value is None:
        raise ValueError(f"El {field_label} es obligatorio.")
    cleaned = re.sub(r"\s+", " ", str(value)).strip()
    if not cleaned:
        raise ValueError(f"El {field_label} es obligatorio.")
    if len(cleaned) < 2:
        raise ValueError(f"El {field_label} debe tener al menos 2 caracteres.")
    if len(cleaned) > 100:
        raise ValueError(f"El {field_label} no puede exceder 100 caracteres.")
    if not NAME_REGEX.match(cleaned):
        raise ValueError(f"El {field_label} solo puede contener letras, números, espacios, apóstrofes y guiones.")
    return cleaned


class RoleType(str, Enum):
    ADMIN = "ADMIN"
    ORGANIZER = "ORGANIZER"
    USER = "USER"


class UserBase(BaseModel):
    email: str = Field(..., max_length=255)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    role: RoleType = Field(default=RoleType.USER)
    is_active: bool = Field(default=True)


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserRegister(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=128)

class UserUpdate(BaseModel):
    email: str | None = Field(default=None, max_length=255)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    role: RoleType | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    is_active: bool | None = None

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value):
        if value is None:
            return value
        cleaned = str(value).strip().lower()
        return cleaned or None

    @field_validator("first_name")
    @classmethod
    def validate_first_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return _validate_person_name(value, "nombre")

    @field_validator("last_name")
    @classmethod
    def validate_last_name(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return _validate_person_name(value, "apellido")


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)