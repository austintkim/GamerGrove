from fastapi import (
    APIRouter, Depends, Request,
    Response, HTTPException, status
)
from typing import Union
from queries.accounts import (
    AccountIn,
    AccountInUpdate,
    AccountInDelete,
    AccountOut,
    AccountQueries,
    AccountToken,
    AccountForm
)
from authenticator import authenticator
from pydantic import BaseModel


class HttpError(BaseModel):
    detail: str


router = APIRouter()

import string

def password_strength(password: str) -> tuple:
    if len(password) < 8:
        upper_score = 0
        lower_score = 0
        number_score = 0
        special_score = 0

        if any(c.isupper() for c in password):
            upper_score += 1
        if any(c.islower() for c in password):
            lower_score += 1
        if any(c.isdigit() for c in password):
            number_score += 1
        if any(c in string.punctuation for c in password):
            special_score += 1

        score = 0

        requirements = {}
        requirements['upper_score'] = upper_score
        requirements['lower_score'] = lower_score
        requirements['number_score'] = number_score
        requirements['special_score'] = special_score

        return (score, requirements)


    upper_score = 0
    lower_score = 0
    number_score = 0
    special_score = 0

    if any(c.isupper() for c in password):
        upper_score += 1
    if any(c.islower() for c in password):
        lower_score += 1
    if any(c.isdigit() for c in password):
        number_score += 1
    if any(c in string.punctuation for c in password):
        special_score += 1

    score = (upper_score + lower_score + number_score + special_score)


    requirements = {}
    requirements['upper_score'] = upper_score
    requirements['lower_score'] = lower_score
    requirements['number_score'] = number_score
    requirements['special_score'] = special_score

    return (score, requirements)

@router.post("/api/accounts", response_model=Union[AccountToken, HttpError])
async def create_account(
    data: AccountIn,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
):

    password_score, conditions = password_strength(data.password)

    if not password_score:
            missing_parts = []
            if not conditions['upper_score']:
                missing_parts.append('at least one uppercase letter')
            if not conditions['lower_score']:
                missing_parts.append('at least one lowercase letter')
            if not conditions['number_score']:
                missing_parts.append('at least one digit from 0-9')
            if not conditions['special_score']:
                missing_parts.append('at least one special character')

            if len(missing_parts) == 1:
                missing = missing_parts[0]
            else:
                missing = ', '.join(missing_parts[:-1]) + f', and {missing_parts[-1]}'

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Your password strength is invalid - it must be at least 8 characters. It must also be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.'
            )
    elif password_score < 3:
        missing_parts = []
        if not conditions['upper_score']:
            missing_parts.append('at least one uppercase letter')
        if not conditions['lower_score']:
            missing_parts.append('at least one lowercase letter')
        if not conditions['number_score']:
            missing_parts.append('at least one digit from 0-9')
        if not conditions['special_score']:
            missing_parts.append('at least one special character')

        if len(missing_parts) == 1:
            missing = missing_parts[0]
        else:
            missing = ', '.join(missing_parts[:-1]) + f', and {missing_parts[-1]}'

        if password_score == 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.'
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least one of the following missing requirements: {missing}.'
            )


    hashed_password = authenticator.hash_password(data.password)

    account = queries.create(data, hashed_password)

    form = AccountForm(username=data.username, password=data.password)
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=account, **token.dict())


@router.get("/api/accounts/username/{username}", response_model=AccountOut)
async def get_account(
    username: str,
    queries: AccountQueries = Depends()
):
    return queries.get(username)

@router.get("/api/accounts/id/{id}", response_model=AccountOut)
async def get_account_by_id(
    id: int,
    queries: AccountQueries = Depends()
):
    return queries.get_by_id(id)


@router.delete("/api/accounts/{id}/{username}", response_model=Union[bool, HttpError])
async def delete_account(
    id: int,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    username = account_data["username"]
    return queries.delete(id, username)


@router.put("/api/accounts/{id}/{username}", response_model=Union[AccountToken, HttpError])
async def update_account(
    id: int,
    data: AccountInUpdate,
    request: Request,
    response: Response,
    queries: AccountQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    username = account_data["username"]

    password_for_login = data.password

    if data.new_password:

        password_for_login = data.new_password

        password_score, conditions = password_strength(data.new_password)

        if not password_score:
            missing_parts = []
            if not conditions['upper_score']:
                missing_parts.append('at least one uppercase letter')
            if not conditions['lower_score']:
                missing_parts.append('at least one lowercase letter')
            if not conditions['number_score']:
                missing_parts.append('at least one digit from 0-9')
            if not conditions['special_score']:
                missing_parts.append('at least one special character')

            if len(missing_parts) == 1:
                missing = missing_parts[0]
            else:
                missing = ', '.join(missing_parts[:-1]) + f', and {missing_parts[-1]}'

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f'Your password strength is invalid - it must be at least 8 characters. It must also be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.'
            )
        elif password_score < 3:
            missing_parts = []
            if not conditions['upper_score']:
                missing_parts.append('at least one uppercase letter')
            if not conditions['lower_score']:
                missing_parts.append('at least one lowercase letter')
            if not conditions['number_score']:
                missing_parts.append('at least one digit from 0-9')
            if not conditions['special_score']:
                missing_parts.append('at least one special character')

            if len(missing_parts) == 1:
                missing = missing_parts[0]
            else:
                missing = ', '.join(missing_parts[:-1]) + f', and {missing_parts[-1]}'

            if password_score == 1:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least two of the following missing requirements: {missing}.'
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f'Your password strength is Weak. It must be at least Moderate to be accepted. Please add at least one of the following missing requirements: {missing}.'
                )

    updated_account = queries.update(id, username, data)

    form = AccountForm(username=data.username, password=password_for_login)
    token = await authenticator.login(response, request, form, queries)
    return AccountToken(account=updated_account, **token.dict())



@router.get("/token", response_model=AccountToken | None)
async def get_token(
    request: Request,
    account: dict = Depends(authenticator.try_get_current_account_data),
) -> AccountToken | None:
    if account and authenticator.cookie_name in request.cookies:
        return {
            "access_token": request.cookies[authenticator.cookie_name],
            "type": "Bearer",
            "account": account
        }
