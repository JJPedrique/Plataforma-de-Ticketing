from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FastAPI + React API")

# Allow requests from React Vite dev server
origins = ["http://localhost:5173","http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI backend!"}

@app.get("/api/items")
def read_items():
    return [
        {"id": 1, "name": "Item One", "status": "Active"},
        {"id": 2, "name": "Item Two", "status": "Pending"},
    ]