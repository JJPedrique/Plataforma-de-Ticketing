from sqlalchemy import DDL, event
from src.database import Base
from src.models import User
from src.models import PayMethod
from src.models import Venue
from src.models import Event
from src.models import Zone
from src.models import EventPricing
from src.models import Seat
from src.models import Order
from src.models import Ticket

__all__ = ["Base","User","PayMethod","Venue","Event","Zone","EventPricing","Seat","Order","Ticket"]

# 1. Define la sentencia SQL usando CREATE OR REPLACE para que sea idempotente
create_book_ticket_proc = DDL("""
CREATE OR REPLACE FUNCTION public.is_seat_available(p_event_id integer, p_seat_id integer, p_order_id integer) RETURNS boolean
    LANGUAGE 'plpgsql' COST 100 VOLATILE PARALLEL UNSAFE
AS $$
DECLARE mySeat INT;
BEGIN  
	SELECT t.id INTO mySeat
	FROM tickets t
	JOIN orders o ON t.order_id = o.id
	WHERE t.event_id = p_event_id
	  AND t.seat_id = p_seat_id
	  AND o.id != p_order_id
	  AND o.status IN ('PENDING', 'COMPLETED');

	IF mySeat IS NOT NULL THEN
		RETURN FALSE;
	END IF;

	RETURN TRUE;
END;
$$;
""")

# 2. Engancha el evento para que se ejecute automáticamente después de crear las tablas
event.listen( Base.metadata, "after_create", create_book_ticket_proc.execute_if(dialect="postgresql"))

