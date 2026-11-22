from enum import Enum
import re
from pydantic import BaseModel, ConfigDict, Field, field_validator


NAME_REGEX = re.compile(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9' -]+$")
CEDULA_REGEX = re.compile(r"^([VE])-?(\d{6,8})$")


def _validate_person_name(value: str | None, field_label: str) -> str | None:
    if value is None:
        return None
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


def _normalize_cedula(value):
    if value is None:
        return None
    raw = re.sub(r"[^VEve0-9-]", "", str(value).strip()).upper()
    match = CEDULA_REGEX.match(raw)
    if not match:
        raise ValueError("Formato válido: V-12345678 o E-12345678 (entre 6 y 8 dígitos).")
    return f"{match.group(1)}-{match.group(2)}"


def _normalize_email(value):
    if value is None:
        return None
    return str(value).strip().lower()


def _normalize_role(value):
    if isinstance(value, str):
        return value.strip().upper()
    return value


class UserNormalizationMixin(BaseModel):
    """Normalizaciones compartidas por todos los esquemas de usuario."""

    @field_validator("first_name", mode="before", check_fields=False)
    @classmethod
    def normalize_first_name(cls, value):
        return _validate_person_name(value, "nombre")

    @field_validator("last_name", mode="before", check_fields=False)
    @classmethod
    def normalize_last_name(cls, value):
        return _validate_person_name(value, "apellido")

    @field_validator("cedula", mode="before", check_fields=False)
    @classmethod
    def normalize_cedula(cls, value):
        return _normalize_cedula(value)

    @field_validator("email", mode="before", check_fields=False)
    @classmethod
    def normalize_email(cls, value):
        return _normalize_email(value)

    @field_validator("role", mode="before", check_fields=False)
    @classmethod
    def normalize_role(cls, value):
        return _normalize_role(value)


class RoleType(str, Enum):
    ADMIN = "ADMIN"
    ORGANIZER = "ORGANIZER"
    USER = "USER"


class UserBase(UserNormalizationMixin):
    email: str = Field(..., max_length=255)
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    cedula: str | None = Field(default=None, max_length=20)
    role: RoleType = Field(default=RoleType.USER)
    is_active: bool = Field(default=True)


class UserCreate(UserBase):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    cedula: str = Field(..., max_length=20)
    password: str = Field(..., min_length=8, max_length=128)


class UserRegister(UserNormalizationMixin):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    cedula: str = Field(..., max_length=20)
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(UserNormalizationMixin):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=1, max_length=128)


class UserChangePassword(UserNormalizationMixin):
    cedula: str = Field(..., max_length=20)
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8, max_length=128)
    confirmPassword: str = Field(..., min_length=8, max_length=128)


class UserUpdate(UserNormalizationMixin):
    first_name: str | None = Field(default=None, min_length=2, max_length=100)
    last_name: str | None = Field(default=None, min_length=2, max_length=100)
    cedula: str | None = Field(default=None, max_length=20)
    email: str | None = Field(default=None, max_length=255)
    role: RoleType | None = Field(default=None)
    is_active: bool | None = Field(default=None)
    password: str | None = Field(default=None, min_length=8, max_length=128)


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
