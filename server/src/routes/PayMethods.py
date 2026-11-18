from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.PayMethod import PayMethod
from src.schemas.PayMethod import PayMethodCreate, PayMethodResponse, PayMethodUpdate

router = APIRouter(tags=["PayMethods"])


@router.get('/PayMethods', response_model=list[PayMethodResponse])
def get_pay_methods(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(PayMethod).where(PayMethod.is_active).offset(skip).limit(limit)
    return db.scalars(stmt).all()


@router.get('/PayMethods/{pay_method_id}', response_model=PayMethodResponse)
def get_pay_method(pay_method_id: int, db: Session = Depends(get_db)):
    pay_method = db.get(PayMethod, pay_method_id)
    if not pay_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Método de pago no encontrado.")
    return pay_method


@router.post('/PayMethods', response_model=PayMethodResponse, status_code=status.HTTP_201_CREATED)
def create_pay_method(payload: PayMethodCreate, db: Session = Depends(get_db)):
    db_pay_method = PayMethod(**payload.model_dump())
    db.add(db_pay_method)
    db.commit()
    db.refresh(db_pay_method)
    return db_pay_method


@router.put('/PayMethods/{pay_method_id}', response_model=PayMethodResponse)
def update_pay_method(pay_method_id: int, payload: PayMethodUpdate, db: Session = Depends(get_db)):
    db_pay_method = db.get(PayMethod, pay_method_id)
    if not db_pay_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Método de pago no encontrado.")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(db_pay_method, key, value)

    db.commit()
    db.refresh(db_pay_method)
    return db_pay_method


@router.delete('/PayMethods/{pay_method_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_pay_method(pay_method_id: int, db: Session = Depends(get_db)):
    db_pay_method = db.get(PayMethod, pay_method_id)
    if not db_pay_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Método de pago no encontrado.")

    try:
        db.delete(db_pay_method)
        db.commit()
    except Exception:
        db.rollback()
        db_pay_method.is_active = False
        db.commit()
    return None
