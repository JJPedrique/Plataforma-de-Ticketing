"""Reglas compartidas con client/src/shared/validation/rules.js.

Si cambias una regex aquí, cámbiala también en el cliente.
"""

import re

NAME_PATTERN = r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$"
CEDULA_PATTERN = r"^([VE])-?(\d{6,8})$"
EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
PASSWORD_PATTERN = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$"
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

NAME_REGEX = re.compile(NAME_PATTERN)
CEDULA_REGEX = re.compile(CEDULA_PATTERN)
PASSWORD_REGEX = re.compile(PASSWORD_PATTERN)


def validate_password_complexity(value: str, field_label: str = "contraseña") -> str:
    """Misma regla que client/src/shared/validation/rules.js."""
    if value is None:
        return value
    if not PASSWORD_REGEX.match(str(value)):
        raise ValueError(
            f"La {field_label} debe tener al menos 8 caracteres, "
            "1 mayúscula, 1 minúscula, 1 número y 1 símbolo."
        )
    return value
