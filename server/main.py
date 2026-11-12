from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, Base, get_db

# Crea las tablas en PostgreSQL si no existen (en producción se recomienda Alembic)
#Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/Debug")
def verificar_conexion():
    return {"status": "conectado :)"}