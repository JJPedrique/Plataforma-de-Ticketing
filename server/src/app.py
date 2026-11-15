from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import Response, FileResponse
from src.database import Base, engine
from src.routes import router 
from fastapi.middleware.cors import CORSMiddleware
import src.models

Base.metadata.create_all(bind=engine)
app = FastAPI()

# Orígenes permitidos (tu frontend en desarrollo)
origins = [
    "http://localhost:5173",  # Puerto por defecto de Vite
    "http://localhost:3000",  # Puerto por defecto de Create React App
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def Debug(): return "Hello world"

app.include_router(router)