from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models import User
from src.schemas.User import *

router = APIRouter(tags=["Users"])

@router.get('/Users', response_model=list[UserResponse])
def get_Users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(User).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Users')
def create_User(User: UserCreate, db: Session = Depends(get_db)):
    db_User = User(**User.model_dump())
    db.add(db_User)
    db.commit()
    db.refresh(db_User)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_User

@router.put("/Users/{User_id}", response_model=UserResponse)
def update_User(User_id: int, User: UserUpdate, db: Session = Depends(get_db)):
    db_User = db.get(User, User_id)
    if not db_User:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usero con id {User_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = User.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_User, key, value)

    db.commit()
    db.refresh(db_User)
    return db_User

@router.delete("/Users/{User_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_User(User_id: int, db: Session = Depends(get_db)):
    db_User = db.get(User, User_id)
    if not db_User:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usero con id {User_id} no encontrado",
        )

    db.delete(db_User)
    db.commit()
    return None