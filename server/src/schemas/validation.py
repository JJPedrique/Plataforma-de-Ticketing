"""Reglas compartidas con client/src/shared/validation/rules.js.

Si cambias una regex aquí, cámbiala también en el cliente.
"""

import re
from datetime import datetime

NAME_PATTERN = r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$"
CEDULA_PATTERN = r"^([VE])-?(\d{6,8})$"
EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
PASSWORD_PATTERN = r"^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$"
PASSWORD_SPACE_PATTERN = r"\s"
HEX_COLOR_PATTERN = r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"

# Texto libre: solo límite de longitud, sin patrón.
VENUE_NAME_MAX_LENGTH = 150
VENUE_CITY_MAX_LENGTH = 100
VENUE_ADDRESS_MAX_LENGTH = 256
VENUE_IMG_URL_MAX_LENGTH = 500
EVENT_TITLE_MAX_LENGTH = 200
EVENT_DESCRIPTION_MAX_LENGTH = 2000
ZONE_NAME_MAX_LENGTH = 100
COLOR_CODE_MAX_LENGTH = 20
PAY_METHOD_NAME_MAX_LENGTH = 100
PAY_METHOD_DESCRIPTION_MAX_LENGTH = 255

EVENT_STATUS_UPCOMING = "UPCOMING"
EVENT_STATUS_ONGOING = "ONGOING"
EVENT_STATUS_FINISHED = "FINISHED"


def to_local_naive(value: datetime) -> datetime:
    """Fechas datetime-local se comparan como hora local del servidor."""
    if value.tzinfo is not None:
        return value.astimezone().replace(tzinfo=None)
    return value


def get_event_status(start_date: datetime, end_date: datetime, now: datetime | None = None) -> str:
    current = to_local_naive(now or datetime.now())
    start = to_local_naive(start_date)
    end = to_local_naive(end_date)
    if current > end:
        return EVENT_STATUS_FINISHED
    if current >= start:
        return EVENT_STATUS_ONGOING
    return EVENT_STATUS_UPCOMING


def validate_event_dates(start_date: datetime, end_date: datetime, allow_past: bool = False) -> None:
    """Regla compartida: fin > inicio e inicio >= ahora salvo corrección histórica."""
    start = to_local_naive(start_date)
    end = to_local_naive(end_date)
    if end <= start:
        raise ValueError("La fecha de fin debe ser posterior a la fecha de inicio.")
    if not allow_past and start < to_local_naive(datetime.now()):
        raise ValueError("La fecha de inicio debe ser mayor o igual a la fecha actual.")


def validate_event_update(
    existing_start: datetime,
    existing_end: datetime,
    new_start: datetime,
    new_end: datetime,
) -> None:
    """Edición: fin > inicio siempre; un evento no finalizado no pasa a histórico
    y uno que aún no empezó no puede moverse al pasado."""
    current = to_local_naive(datetime.now())
    start = to_local_naive(new_start)
    end = to_local_naive(new_end)
    if end <= start:
        raise ValueError("La fecha de fin debe ser posterior a la fecha de inicio.")
    if get_event_status(existing_start, existing_end) == EVENT_STATUS_FINISHED:
        return
    if end <= current:
        raise ValueError(
            "La fecha de fin debe ser futura; de lo contrario el evento pasaría a histórico."
        )
    if start < current and to_local_naive(existing_start) >= current:
        raise ValueError("La fecha de inicio debe ser mayor o igual a la fecha actual.")


NAME_REGEX = re.compile(NAME_PATTERN)
CEDULA_REGEX = re.compile(CEDULA_PATTERN)
PASSWORD_REGEX = re.compile(PASSWORD_PATTERN)
PASSWORD_SPACE_REGEX = re.compile(PASSWORD_SPACE_PATTERN)


def validate_password_complexity(value: str, field_label: str = "contraseña") -> str:
    """Misma regla que client/src/shared/validation/rules.js."""
    if value is None:
        return value
    if PASSWORD_SPACE_REGEX.search(str(value)):
        raise ValueError("La contraseña no puede contener espacios.")
    if not PASSWORD_REGEX.match(str(value)):
        raise ValueError(
            f"La {field_label} debe tener al menos 8 caracteres, "
            "1 mayúscula, 1 minúscula, 1 número y 1 símbolo."
        )
    return value
