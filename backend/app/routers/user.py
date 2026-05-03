from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel

from app.auth import get_current_user

router = APIRouter()


class UserOut(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    email: Optional[str] = None


@router.get("/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return UserOut(
        uid          = current_user["uid"],
        email        = current_user.get("email", ""),
        display_name = current_user.get("name"),
    )


@router.put("/me", response_model=UserOut)
def update_me(
    body: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    uid = current_user["uid"]
    kwargs = {}
    if body.display_name is not None:
        kwargs["display_name"] = body.display_name
    if body.email is not None:
        kwargs["email"] = body.email
    if not kwargs:
        raise HTTPException(status_code=400, detail="Nothing to update")
    try:
        firebase_auth.update_user(uid, **kwargs)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    updated = firebase_auth.get_user(uid)
    return UserOut(
        uid          = updated.uid,
        email        = updated.email or "",
        display_name = updated.display_name,
    )
