from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, text
from database import engine, Base, get_db
import models, schemas

# Crea las tablas en PostgreSQL si no existen (en producción se recomienda Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/Debug")
def verificar_conexion():
    return {"status": "conectado :)"}

@app.get("/events/{id}", response_model=schemas.EventBase)
def GetEventsById(id: int, db: Session = Depends(get_db)):
    event = db.get(models.Event, id)
    if not event: raise HTTPException(status_code=404, detail="Item not found")
    return event

@app.get("/events/search?={title}", response_model=list[schemas.EventBase])
def GetEventsByName(title: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(models.Event).where(models.Event.title.ilike(f"%{title}%")).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@app.get("/events/", response_model=list[schemas.EventBase])
def GetAllEvents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(models.Event).offset(skip).limit(limit)
    return db.scalars(stmt).all()
