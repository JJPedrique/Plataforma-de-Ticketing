"""Parámetros de paginación compartidos por todos los listados del API."""

from fastapi import Query


class PaginationParams:
    """Inyectable con Depends(): mantiene `skip` y `limit` como query params.

    `limit` tenía antes un valor por defecto de 100 pero sin tope: ahora
    cualquier lista acepta como máximo 200 registros por petición.
    """

    def __init__(
        self,
        skip: int = Query(0, ge=0, description="Registros a omitir"),
        limit: int = Query(100, ge=1, le=200, description="Cantidad máxima de registros"),
    ) -> None:
        self.skip = skip
        self.limit = limit
