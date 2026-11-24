// Reglas de validación compartidas por los formularios del cliente.
// Mantener en sincronía con server/src/schemas/validation.py.

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const NAME_PATTERN = "^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$";
export const NAME_REGEX = new RegExp(NAME_PATTERN);
export const NAME_TITLE = 'Solo letras, espacios, apóstrofes y guiones (mínimo 2 caracteres)';

export const CEDULA_MIN_LENGTH = 7;
export const CEDULA_MAX_LENGTH = 10;
export const CEDULA_PATTERN = "^([VE])-?(\\d{6,8})$";
export const CEDULA_REGEX = new RegExp(CEDULA_PATTERN);
export const CEDULA_TITLE = 'Formato válido: V-12345678 o E-12345678 (entre 6 y 8 dígitos)';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_PATTERN = "^(?!.*\\s)(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9\\s]).{8,}$";
export const PASSWORD_REGEX = new RegExp(PASSWORD_PATTERN);
export const PASSWORD_SPACE_PATTERN = "\\s";
export const PASSWORD_SPACE_REGEX = new RegExp(PASSWORD_SPACE_PATTERN);
export const UPPERCASE_REGEX = /[A-Z]/;
export const LOWERCASE_REGEX = /[a-z]/;
export const DIGIT_REGEX = /\d/;
export const SYMBOL_REGEX = /[^A-Za-z0-9\s]/;
export const PASSWORD_TITLE = 'Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo';

export const EMAIL_MAX_LENGTH = 255;
export const EMAIL_PATTERN = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
export const EMAIL_REGEX = new RegExp(EMAIL_PATTERN);

/** Quita cualquier espacio del correo antes de validarlo o enviarlo. */
export function sanitizeEmail(value) {
  return String(value ?? '').replace(/\s+/g, '').trim();
}

export const PHONE_LENGTH = 7;
export const PHONE_PATTERN = "\\d{7}";
export const PHONE_REGEX = new RegExp(`^${PHONE_PATTERN}$`);

export const REFERENCE_MIN_LENGTH = 6;
export const REFERENCE_MAX_LENGTH = 16;
export const REFERENCE_PATTERN = "\\d{6,16}";
export const REFERENCE_REGEX = new RegExp(`^${REFERENCE_PATTERN}$`);

export const HEX_COLOR_PATTERN = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
export const HEX_COLOR_REGEX = new RegExp(HEX_COLOR_PATTERN);

export const HASH_MIN_LENGTH = 32;
export const HASH_MAX_LENGTH = 64;
export const HASH_PATTERN = "^[a-fA-F0-9]{32,64}$";
export const HASH_REGEX = new RegExp(HASH_PATTERN);

export const EXPIRY_PATTERN = '(0[1-9]|1[0-2])/[0-9]{2}';

// Texto libre: solo límite de longitud, sin patrón.
export const VENUE_NAME_MAX_LENGTH = 150;
export const VENUE_CITY_MAX_LENGTH = 100;
export const VENUE_ADDRESS_MAX_LENGTH = 256;
export const VENUE_IMG_URL_MAX_LENGTH = 500;
export const EVENT_TITLE_MAX_LENGTH = 200;
export const EVENT_DESCRIPTION_MAX_LENGTH = 2000;
export const ZONE_NAME_MAX_LENGTH = 100;
export const COLOR_CODE_MAX_LENGTH = 20;
export const PAY_METHOD_NAME_MAX_LENGTH = 100;
export const PAY_METHOD_DESCRIPTION_MAX_LENGTH = 255;
export const CONTACT_SUBJECT_MAX_LENGTH = 150;
export const CONTACT_MESSAGE_MAX_LENGTH = 2000;

// El formulario de tarjetas usa una sola regla laxa para cualquier franquicia:
// no hay tarjetas reales para comprobar reglas específicas por marca.
const CARD_CONFIG = Object.freeze({
  number: {
    placeholder: '1234 5678 9012 3456',
    maxLength: 23,
    pattern: "^(?:[0-9]\\s?){12,18}[0-9]$",
    title: 'Ingresa un número de tarjeta válido de 13 a 19 dígitos',
  },
  cvc: {
    label: 'CVC',
    placeholder: '123',
    maxLength: 4,
    pattern: '[0-9]{3,4}',
    title: 'Código de seguridad de 3 o 4 dígitos',
  },
});

export function getCardConfig() {
  return CARD_CONFIG;
}
