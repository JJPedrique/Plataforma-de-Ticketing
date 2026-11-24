"""Textos HTTP compartidos para que todas las rutas respondan igual."""


def not_found(entity: str, entity_id: int | None = None, *, feminine: bool = False) -> str:
    """Construye el detalle de un 404 con el mismo formato en todo el API.

    Ejemplos:
        not_found("Ticket", 7)            -> "Ticket con id 7 no encontrado."
        not_found("Orden", 7, feminine=True) -> "Orden con id 7 no encontrada."
        not_found("Evento")               -> "Evento no encontrado."
    """
    suffix = "no encontrada." if feminine else "no encontrado."
    return f"{entity} con id {entity_id} {suffix}" if entity_id is not None else f"{entity} {suffix}"
