from fastapi import APIRouter
from src.schemas.User import *

router = APIRouter(tags=["Users"])

@router.get('/users')
def get_users():
    pass

@router.post('/users')
def create_user(user: UserCreate):
    pass

@router.put('/users/{user_id}')
def update_user(user_id: int, user: UserUpdate):
    pass

@router.delete('/users/{user_id}')
def update_user(user_id: int):
    pass