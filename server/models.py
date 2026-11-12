import enum
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from sqlalchemy import String, Text, Integer, Boolean, DateTime, Numeric, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

# --- ENUMS ---
class RoleType(enum.Enum):
    ADMIN = "admin"
    ORGANIZER = "organizer"
    CUSTOMER = "customer"

class OrderStatus(enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed" 
    CANCELLED = "cancelled"

# --- MODELS ---
class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    role: Mapped[RoleType] = mapped_column(Enum(RoleType))
    first_name: Mapped[Optional[str]] = mapped_column(String(100))
    last_name: Mapped[Optional[str]] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255))
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    orders: Mapped[List["Order"]] = relationship(back_populates="user")
    events: Mapped[List["Event"]] = relationship(back_populates="organizer")


class PayMethod(Base):
    __tablename__ = "pay_methods"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[Optional[str]] = mapped_column(String(50))
    description: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    orders: Mapped[List["Order"]] = relationship(back_populates="pay_method")


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(String(100))
    img_url: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    events: Mapped[List["Event"]] = relationship(back_populates="venue")
    zones: Mapped[List["Zone"]] = relationship(back_populates="venue")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    organizer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    start_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    end_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    organizer: Mapped["User"] = relationship(back_populates="events")
    venue: Mapped["Venue"] = relationship(back_populates="events")
    pricings: Mapped[List["EventPricing"]] = relationship(back_populates="event")
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="event")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    total_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2))
    status: Mapped[Optional[OrderStatus]] = mapped_column(Enum(OrderStatus))
    pay_method_id: Mapped[int] = mapped_column(ForeignKey("pay_methods.id"), nullable=False)
    pay_methods_ref: Mapped[Optional[str]] = mapped_column(String(100))
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="orders")
    pay_method: Mapped["PayMethod"] = relationship(back_populates="orders")
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="order")


class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id"), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(String(100))
    color_code: Mapped[Optional[str]] = mapped_column(String(20))
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    venue: Mapped["Venue"] = relationship(back_populates="zones")
    pricings: Mapped[List["EventPricing"]] = relationship(back_populates="zone")
    seats: Mapped[List["Seat"]] = relationship(back_populates="zone")


class EventPricing(Base):
    __tablename__ = "event_pricings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    zone_id: Mapped[int] = mapped_column(ForeignKey("zones.id"), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)

    # Relationships
    event: Mapped["Event"] = relationship(back_populates="pricings")
    zone: Mapped["Zone"] = relationship(back_populates="pricings")


class Seat(Base):
    __tablename__ = "seats"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    zone_id: Mapped[int] = mapped_column(ForeignKey("zones.id"), nullable=False)
    row_label: Mapped[Optional[str]] = mapped_column(String(10))
    seat_number: Mapped[Optional[str]] = mapped_column(String(10))
    coord_x: Mapped[Optional[int]] = mapped_column(Integer)
    coord_y: Mapped[Optional[int]] = mapped_column(Integer)
    is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

    # Relationships
    zone: Mapped["Zone"] = relationship(back_populates="seats")
    tickets: Mapped[List["Ticket"]] = relationship(back_populates="seat")


class Ticket(Base):
    __tablename__ = "tickets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    seat_id: Mapped[int] = mapped_column(ForeignKey("seats.id"), nullable=False)

    # Relationships
    event: Mapped["Event"] = relationship(back_populates="tickets")
    order: Mapped["Order"] = relationship(back_populates="tickets")
    seat: Mapped["Seat"] = relationship(back_populates="tickets")