from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import Response, FileResponse
from src.database import Base, engine
from src.routes import router 
import src.models

Base.metadata.create_all(bind=engine)
app = FastAPI()

@app.get("/")
def Debug(): return "Hello world"

app.include_router(router)