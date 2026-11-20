import hashlib
import hmac
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.User import User, RoleType as ModelRoleType
from src.schemas.User import UserCreate, UserLogin, UserRegister, UserResponse, UserUpdate

router = APIRouter(tags=["Users"])


def _hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000).hex()
    return f"pbkdf2_sha256${salt}${digest}"


def _verify_password(password: str, stored_hash: str | None) -> bool:
    if not stored_hash:
        return False
    if stored_hash.startswith("pbkdf2_sha256$"):
        try:
            _, salt, digest = stored_hash.split("$", 2)
        except ValueError:
            return False
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 120000).hex()
        return hmac.compare_digest(candidate, digest)
    # Compatibilidad con datos sembrados/mock (texto plano o hash simple de ejemplo)
    return hmac.compare_digest(password, stored_hash)


def _get_user_or_404(user_id: int, db: Session) -> User:
    db_user = db.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    return db_user


@router.get('/Users', response_model=list[UserResponse])
def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stmt = select(User).offset(skip).limit(limit)
    return db.scalars(stmt).all()


@router.get('/Users/{user_id}', response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return _get_user_or_404(user_id, db)



@router.post('/Users/login', response_model=UserResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    stmt = select(User).where(User.email == payload.email)
    user = db.scalars(stmt).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo, contacte a soporte para reactivar la cuenta."
        )
    if not _verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales Invalidas."
        )
        
    return user

@router.post('/Users/register', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.scalars(select(User).where(User.email == payload.email)).first()
    if existing: raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya existe una cuenta con ese correo.")

    db_user = User(
        email=payload.email,
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        role=ModelRoleType.USER,
        password_hash=_hash_password(payload.password),
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post('/Users', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.scalars(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No se pudo crear el usuario con los datos proporcionados.")

    data = payload.model_dump()
    password = data.pop("password")
    data["password_hash"] = _hash_password(password)
    db_user = User(**data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/Users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    db_user = _get_user_or_404(user_id, db)

    update_data = payload.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"] and update_data["email"] != db_user.email:
        existing = db.scalars(select(User).where(User.email == update_data["email"], User.id != user_id)).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="No se pudo actualizar el usuario con los datos proporcionados.")

    password = update_data.pop("password", None)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    if password:
        db_user.password_hash = _hash_password(password)

    db.commit()
    db.refresh(db_user)
    return db_user


@router.delete("/Users/{user_id}", response_model=UserResponse)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    db_user = _get_user_or_404(user_id, db)
    db_user.is_active = False
    db.commit()
    db.refresh(db_user)
    return db_user
