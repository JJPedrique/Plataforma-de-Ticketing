from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.PayMethod import PayMethod
from src.schemas.PayMethod import *

router = APIRouter(tags=["PayMethods"])

@router.get('/pays', response_model=list[PayMethodResponse])
def get_payMethods():
    pass

@router.post('/pays')
def create_payMethod(payMethod: PayMethodCreate, db: Session = Depends(get_db)):
    db_PayMethod = PayMethod(**payMethod.model_dump())
    db.add(db_PayMethod)
    db.commit()
    db.refresh(db_PayMethod)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_PayMethod

@router.put('/pays/{payMethod_id}', response_model=PayMethodResponse)
def update_PayMethod(PayMethod_id: int, PayMethod: PayMethodUpdate, db: Session = Depends(get_db)):
    db_PayMethod = db.get(PayMethod, PayMethod_id)
    if not db_PayMethod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PayMethodo con id {PayMethod_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = PayMethod.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_PayMethod, key, value)

    db.commit()
    db.refresh(db_PayMethod)
    return db_PayMethod

@router.delete('/pays/{payMethod_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_PayMethod(PayMethod_id: int, db: Session = Depends(get_db)):
    db_PayMethod = db.get(PayMethod, PayMethod_id)
    if not db_PayMethod:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PayMethodo con id {PayMethod_id} no encontrado",
        )

    db.delete(db_PayMethod)
    db.commit()
    return None