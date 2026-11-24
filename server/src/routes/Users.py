import hashlib
import hmac
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database import get_db
from src.models.User import User, RoleType as ModelRoleType
from src.schemas.User import (
    UserChangePassword,
    UserCreate,
    UserLogin,
    UserRegister,
    UserResponse,
    UserUpdate,
)
from src.messages import not_found
from src.pagination import PaginationParams

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

    return hmac.compare_digest(password, stored_hash)


def _to_model_role(value) -> ModelRoleType:
    if isinstance(value, ModelRoleType):
        return value
    raw = str(getattr(value, "value", value)).strip().upper()
    if raw in ModelRoleType.__members__:
        return ModelRoleType[raw]
    return ModelRoleType.USER


def _cedula_taken(db: Session, cedula: str | None, exclude_user_id: int | None = None) -> bool:
    if not cedula:
        return False
    stmt = select(User.id).where(User.cedula == cedula)
    if exclude_user_id is not None:
        stmt = stmt.where(User.id != exclude_user_id)
    return db.scalar(stmt) is not None


def _email_taken(db: Session, email: str | None, exclude_user_id: int | None = None) -> bool:
    if not email:
        return False
    stmt = select(User.id).where(User.email == email)
    if exclude_user_id is not None:
        stmt = stmt.where(User.id != exclude_user_id)
    return db.scalar(stmt) is not None


def _get_user_or_404(user_id: int, db: Session) -> User:
    db_user = db.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found("Usuario"),)
    return db_user


@router.post('/Users/login', response_model=UserResponse)
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.scalars(select(User).where(User.email == payload.email)).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=not_found("Usuario"),
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

    if existing:
        if not existing.is_active:
            if _cedula_taken(db, payload.cedula, exclude_user_id=existing.id):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Ya existe una cuenta con esa cedula."
                )

            data = payload.model_dump(exclude_unset=True)
            data.pop("password", None)
            data["role"] = ModelRoleType.USER
            data["is_active"] = True
            for key, value in data.items():
                setattr(existing, key, value)
            existing.password_hash = _hash_password(payload.password)
            db.commit()
            db.refresh(existing)
            return existing

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo."
        )

    if _cedula_taken(db, payload.cedula):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con esa cedula."
        )

    db_user = User(
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=ModelRoleType.USER,
        password_hash=_hash_password(payload.password),
        cedula=payload.cedula,
        is_active=True,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get('/Users', response_model=list[UserResponse])
def get_users(pagination: PaginationParams = Depends(), db: Session = Depends(get_db)):
    stmt = select(User).offset(pagination.skip).limit(pagination.limit)
    return db.scalars(stmt).all()


@router.get('/Users/{user_id}', response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return _get_user_or_404(user_id, db)


@router.post('/Users/showPassword')
def show_password(email: str, db: Session = Depends(get_db)):
    existing = db.scalars(select(User).where(User.email == email)).first()
    return existing.password_hash


@router.post('/Users', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    if _email_taken(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo."
        )
    if _cedula_taken(db, payload.cedula):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con esa cedula."
        )

    data = payload.model_dump()
    password = data.pop("password")
    data["password_hash"] = _hash_password(password)
    data["role"] = _to_model_role(data.get("role"))
    db_user = User(**data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.put("/Users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db)):
    current = _get_user_or_404(user_id, db)
    data = payload.model_dump(exclude_unset=True)

    if data.get("email") and _email_taken(db, data["email"], exclude_user_id=user_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con ese correo."
        )
    if data.get("cedula") and _cedula_taken(db, data["cedula"], exclude_user_id=user_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una cuenta con esa cedula."
        )

    if data.get("role") is not None:
        data["role"] = _to_model_role(data["role"])

    password = data.pop("password", None)
    if password:
        data["password_hash"] = _hash_password(password)

    for key, value in data.items():
        setattr(current, key, value)

    db.commit()
    db.refresh(current)
    return current


@router.delete("/Users/{user_id}", response_model=UserResponse)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    current = _get_user_or_404(user_id, db)
    current.is_active = False
    db.commit()
    db.refresh(current)
    return current


@router.post('/Users/newPassword', response_model=UserResponse)
def change_password(payload: UserChangePassword, db: Session = Depends(get_db)):
    check_user = db.scalar(
        select(User).where(User.cedula == payload.cedula, User.email == payload.email)
    )
    if not check_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No hay una cuenta que coincida con esa cedula y email."
        )
    if payload.password != payload.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Las contraseña no coinciden."
        )

    check_user.password_hash = _hash_password(payload.password)
    db.commit()
    db.refresh(check_user)
    return check_user
