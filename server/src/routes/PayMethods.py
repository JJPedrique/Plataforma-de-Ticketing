from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.PayMethod import PayMethod
from src.schemas.PayMethod import PayMethodResponse, PayMethodStatusUpdate
from src.messages import not_found
from src.pagination import PaginationParams

router = APIRouter(tags=["PayMethods"])


def _get_pay_method_or_404(pay_method_id: int, db: Session) -> PayMethod:
    pay_method = db.get(PayMethod, pay_method_id)
    if not pay_method:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Método de pago"),)
    return pay_method


@router.get('/PayMethods', response_model=list[PayMethodResponse])
def get_pay_methods(include_inactive: bool = False, pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(PayMethod)
    if not include_inactive:
        stmt = stmt.where(PayMethod.is_active)
    stmt = stmt.order_by(PayMethod.id).offset(pagination.skip).limit(pagination.limit)
    return db.scalars(stmt).all()


@router.get('/PayMethods/{pay_method_id}', response_model=PayMethodResponse)
def get_pay_method(pay_method_id: int, db: Session = Depends(get_db)):
    return _get_pay_method_or_404(pay_method_id, db)


@router.put('/PayMethods/{pay_method_id}/status', response_model=PayMethodResponse)
def update_pay_method_status(pay_method_id: int, payload: PayMethodStatusUpdate, db: Session = Depends(get_db)):
    db_pay_method = _get_pay_method_or_404(pay_method_id, db)
    db_pay_method.is_active = payload.is_active
    db.commit()
    db.refresh(db_pay_method)
    return db_pay_method
