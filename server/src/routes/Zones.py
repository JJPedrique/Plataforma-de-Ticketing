from fastapi import APIRouter, Depends, HTTPException, status
from src.database import get_db
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.models.Zone import Zone
from src.schemas.Zone import *

router = APIRouter(tags=["Zones"])

@router.get('/Zones', response_model=list[ZoneResponse])
def get_Zones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(Zone).offset(skip).limit(limit)
    return db.scalars(stmt).all()

@router.post('/Zones')
def create_Zone(Zone: ZoneCreate, db: Session = Depends(get_db)):
    db_Zone = Zone(**Zone.model_dump())
    db.add(db_Zone)
    db.commit()
    db.refresh(db_Zone)  # Recarga el objeto con el ID y campos generados por PostgreSQL
    return db_Zone

@router.put("/Zones/{Zone_id}", response_model=ZoneResponse)
def update_Zone(Zone_id: int, Zone: ZoneUpdate, db: Session = Depends(get_db)):
    db_Zone = db.get(Zone, Zone_id)
    if not db_Zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zoneo con id {Zone_id} no encontrado",
        )

    # exclude_unset=True evita sobrescribir con None los campos que no se enviaron
    update_data = Zone.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_Zone, key, value)

    db.commit()
    db.refresh(db_Zone)
    return db_Zone

@router.delete("/Zones/{Zone_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_Zone(Zone_id: int, db: Session = Depends(get_db)):
    db_Zone = db.get(Zone, Zone_id)
    if not db_Zone:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zoneo con id {Zone_id} no encontrado",
        )

    db.delete(db_Zone)
    db.commit()
    return None