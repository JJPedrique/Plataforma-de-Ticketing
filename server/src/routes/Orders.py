import asyncio
from typing import List
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from src.database import SessionLocal, get_db
from sqlalchemy import and_, select
from sqlalchemy.orm import Session


from src.models.Order import Order
from src.models.Event import Event
from src.models.EventPricing import EventPricing
from src.models.PayMethod import PayMethod
from src.models.Seat import Seat
from src.models.Ticket import Ticket
from src.models.Venue import Venue
from src.models.Zone import Zone
from src.schemas.Order import OrderCreate, OrderResponse, OrderUpdate, PurchaseHistorySchema, PurchasedSeatSchema

router = APIRouter(tags=["Orders"])

@router.get('/Orders', response_model=list[OrderResponse])
def get_Orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Order).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Orders')
def create_Order(background_tasks: BackgroundTasks, order: OrderCreate, db: Session = Depends(get_db)):
    db_Order = Order(**order.model_dump())
    db.add(db_Order)
    db.commit()
    db.refresh(db_Order)  
    background_tasks.add_task(actualizar_fila_diferida,db_Order.id)
    return db_Order

@router.put("/Orders/{Order_id}", response_model=OrderResponse)
def update_Order(Order_id: int, order: OrderUpdate, db: Session = Depends(get_db)):
    db_Order = db.get(Order, Order_id)
    if not db_Order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordero con id {Order_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = order.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Order, key, value)

    db.commit()
    db.refresh(db_Order)
    return db_Order

@router.delete("/Orders/{Order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Order(Order_id: int, db: Session = Depends(get_db)):
    db_Order = db.get(Order, Order_id)
    if not db_Order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ordero con id {Order_id} no encontrado",
        )

    db.delete(db_Order)
    db.commit()
    return None

async def actualizar_fila_diferida(row_id: int, segundos: int = 300):
    await asyncio.sleep(segundos)

    db = SessionLocal()
    try:
        fila = db.query(Order).filter(Order.id == row_id).first()
        if not fila or fila.status != "PENDING": return
        fila.status = "CANCELLED"
        db.commit()
    finally: db.close()

@router.get("/Orders/{user_id}/purchases", response_model=List[PurchaseHistorySchema])
def get_user_purchase_history(user_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(
            Order.id.label("order_id"),
            Order.total_amount,
            Order.created_at.label("completed_at"),
            PayMethod.name.label("payment_method"),
            Order.pay_methods_ref.label("payment_reference"),
            Event.id.label("event_id"),
            Event.title.label("event_title"),
            Event.description.label("event_description"),
            Event.start_date.label("event_start_date"),
            Event.end_date.label("event_end_date"),
            Venue.name.label("venue_name"),
            Venue.address.label("venue_address"),
            Venue.city.label("venue_city"),
            Venue.img_url.label("venue_img_url"),
            Ticket.id.label("ticket_id"),
            Zone.name.label("zone_name"),
            Zone.color_code.label("zone_color"),
            Seat.row_label,
            Seat.seat_number,
            EventPricing.price,
        )
        .join(PayMethod, Order.pay_method_id == PayMethod.id)
        .join(Ticket, Ticket.order_id == Order.id)
        .join(Event, Ticket.event_id == Event.id)
        .join(Venue, Event.venue_id == Venue.id)
        .join(Seat, Ticket.seat_id == Seat.id)
        .join(Zone, Seat.zone_id == Zone.id)
        .outerjoin(
            EventPricing,
            and_(
                EventPricing.event_id == Event.id,
                EventPricing.zone_id == Zone.id,
            ),
        )
        .where(
            Order.user_id == user_id,
            Order.status == "COMPLETED",
        )
        .order_by(
            Order.created_at.desc(),
            Zone.name.asc(),
            Seat.row_label.asc(),
            Seat.seat_number.asc(),
        )
    )

    rows = db.execute(stmt).all()

    # Agrupamos las filas por orden para anidar los tickets sin duplicar la cabecera
    orders_map: dict[int, PurchaseHistorySchema] = {}

    for row in rows:
        if row.order_id not in orders_map:
            orders_map[row.order_id] = PurchaseHistorySchema(
                order_id=row.order_id,
                total_amount=row.total_amount,
                completed_at=row.completed_at,
                payment_method=row.payment_method,
                payment_reference=row.payment_reference,
                event_id=row.event_id,
                event_title=row.event_title,
                event_description=row.event_description,
                event_start_date=row.event_start_date,
                event_end_date=row.event_end_date,
                venue_name=row.venue_name,
                venue_address=row.venue_address,
                venue_city=row.venue_city,
                venue_img_url=row.venue_img_url,
                tickets=[],
            )

        orders_map[row.order_id].tickets.append(
            PurchasedSeatSchema(
                ticket_id=row.ticket_id,
                zone_name=row.zone_name,
                zone_color=row.zone_color,
                row_label=row.row_label,
                seat_number=row.seat_number,
                price=row.price,
            )
        )

    return list(orders_map.values())


@router.get("/Orders/{user_id}/purchases/{order_id}", response_model=PurchaseHistorySchema)
def get_user_purchase_detail(user_id: int, order_id: int, db: Session = Depends(get_db)):
    stmt = (
        select(
            Order.id.label("order_id"),
            Order.total_amount,
            Order.created_at.label("completed_at"),
            PayMethod.name.label("payment_method"),
            Order.pay_methods_ref.label("payment_reference"),
            Event.id.label("event_id"),
            Event.title.label("event_title"),
            Event.description.label("event_description"),
            Event.start_date.label("event_start_date"),
            Event.end_date.label("event_end_date"),
            Venue.name.label("venue_name"),
            Venue.address.label("venue_address"),
            Venue.city.label("venue_city"),
            Venue.img_url.label("venue_img_url"),
            Ticket.id.label("ticket_id"),
            Zone.name.label("zone_name"),
            Zone.color_code.label("zone_color"),
            Seat.row_label,
            Seat.seat_number,
            EventPricing.price,
        )
        .join(PayMethod, Order.pay_method_id == PayMethod.id)
        .join(Ticket, Ticket.order_id == Order.id)
        .join(Event, Ticket.event_id == Event.id)
        .join(Venue, Event.venue_id == Venue.id)
        .join(Seat, Ticket.seat_id == Seat.id)
        .join(Zone, Seat.zone_id == Zone.id)
        .outerjoin(
            EventPricing,
            and_(
                EventPricing.event_id == Event.id,
                EventPricing.zone_id == Zone.id,
            ),
        )
        .where(
            Order.user_id == user_id,
            Order.id == order_id,
            Order.status == "COMPLETED",
        )
        .order_by(
            Zone.name.asc(),
            Seat.row_label.asc(),
            Seat.seat_number.asc(),
        )
    )

    rows = db.execute(stmt).all()

    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden de compra no encontrada o no completada",
        )

    first_row = rows[0]

    return PurchaseHistorySchema(
        order_id=first_row.order_id,
        total_amount=first_row.total_amount,
        completed_at=first_row.completed_at,
        payment_method=first_row.payment_method,
        payment_reference=first_row.payment_reference,
        event_id=first_row.event_id,
        event_title=first_row.event_title,
        event_description=first_row.event_description,
        event_start_date=first_row.event_start_date,
        event_end_date=first_row.event_end_date,
        venue_name=first_row.venue_name,
        venue_address=first_row.venue_address,
        venue_city=first_row.venue_city,
        venue_img_url=first_row.venue_img_url,
        tickets=[
            PurchasedSeatSchema(
                ticket_id=row.ticket_id,
                zone_name=row.zone_name,
                zone_color=row.zone_color,
                row_label=row.row_label,
                seat_number=row.seat_number,
                price=row.price,
            )
            for row in rows
        ],
    )