import string
from typing import Any, Union

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import BaseModel

from api.authenticator import authenticator

from ..queries.accounts import AccountForm, AccountIn, AccountInDelete, AccountInUpdate, AccountOut, AccountQueries, AccountToken


class HttpError(BaseModel):
    detail: str


router = APIRouter()


def password_strength(password: str) -> tuple[int, dict[str, int]]:
    upper_score = 1 if any(c.isupper() for c in password) else 0
    lower_score = 1 if any(c.islower() for c in password) else 0
    number_score = 1 if any(c.isdigit() for c in password) else 0
    special_score = 1 if any(c in string.punctuation for c in password) else 0

    requirements: dict[str, int] = {
        "upper_score": upper_score,
        "lower_score": lower_score,
        "number_score": number_score,
        "special_score": special_score,
    }

    if len(password) < 8:
        return (0, requirements)

    score = upper_score + lower_score + number_score + special_score
    return (score, requirements)


def get_missing_parts(conditions: dict[str, int]) -> str:
    missing_parts: list[str] = []
    if not conditions["upper_score"]:
        missing_parts.append("at least one uppercase letter")
    if not conditions["lower_score"]:
        missing_parts.append("at least one lowercase letter")
    if not conditions["number_score"]:
        missing_parts.append("at least one digit from 0-9")
    if not conditions["special_score"]:
        missing_parts.append("at least one special character")

    if len(missing_parts) == 1:
        return missing_parts[0]
    else:
        return ", ".join(missing_parts[:-1]) + f", and {missing_parts[-1]}"


@router.post("/api/accounts", response_model=Union[AccountToken, HttpError])
async def create_account(
    data: AccountIn,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
):
    password_score, conditions = password_strength(data.password)

    if not password_score:
        missing = get_missing_parts(conditions)

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Your password strength is invalid - it must be at least 8 characters. It must also be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.",
        )
    elif password_score < 3:
        missing = get_missing_parts(conditions)

        if password_score == 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.",
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least one of the following missing requirements: {missing}.",
            )

    hashed_password = authenticator.hash_password(data.password)  # type: ignore

    account = queries.create(data, hashed_password)

    form = AccountForm(username=data.username, password=data.password)
    token = await authenticator.login(response, request, form, queries)  # type: ignore
    return AccountToken(account=account, **token.dict())


@router.get("/api/accounts/username/{username}", response_model=AccountOut)
async def get_account(username: str, queries: AccountQueries = Depends()):
    return queries.get(username)


@router.get("/api/accounts/id/{id}", response_model=AccountOut)
async def get_account_by_id(id: int, queries: AccountQueries = Depends()):
    return queries.get_by_id(id)


@router.delete("/api/accounts/{id}/{username}", response_model=Union[bool, HttpError])
async def delete_account(
    id: int,
    data: AccountInDelete,
    queries: AccountQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
) -> bool:
    username = account_data["username"]
    return queries.delete(id, username, data)


@router.put("/api/accounts/{id}/{username}", response_model=Union[AccountToken, HttpError])
async def update_account(
    id: int,
    data: AccountInUpdate,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    username = account_data["username"]

    password_for_login = data.password

    if data.new_password:
        password_for_login = data.new_password

        password_score, conditions = password_strength(data.new_password)

        if not password_score:
            missing = get_missing_parts(conditions)

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Your password strength is invalid - it must be at least 8 characters. It must also be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.",
            )
        elif password_score < 3:
            missing = get_missing_parts(conditions)

            if password_score == 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.",
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least one of the following missing requirements: {missing}.",
                )

    updated_account = queries.update(id, username, data)

    form = AccountForm(username=data.username, password=password_for_login)
    token = await authenticator.login(response, request, form, queries)  # type: ignore
    return AccountToken(account=updated_account, **token.dict())


@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account_data: dict[str, Any] = Depends(authenticator.try_get_current_account_data),  # type:ignore
) -> AccountToken | None:
    if account_data and authenticator.cookie_name in request.cookies:
        account = AccountOut(**account_data)
        return AccountToken(
            access_token=request.cookies[authenticator.cookie_name],
            token_type="Bearer",
            account=account,
        )
    return None
