import os
import secrets
import string
from datetime import datetime, timedelta
from typing import Any, Union

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, Response, status
from mailjet_rest import Client
from psycopg.errors import UniqueViolation
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

from api.authenticator import authenticator

from ..queries.accounts import AccountForm, AccountIn, AccountInDelete, AccountInUpdate, AccountOut, AccountQueries, AccountToken, ResetEmailForm, UpdatePasswordForm
from ..settings import settings

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


class HttpError(BaseModel):
    detail: str


router = APIRouter()


def verify_account(email: str):
    with pool.connection() as conn:
        with conn.cursor() as db:
            result = db.execute(
                """
                SELECT * FROM accounts
                WHERE email = %s;
                """,
                [email],
            )

            row = result.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find an account with that email",
                )
            else:
                print(row)


def generate_unique_token(email: str, max_retries: int = 5):
    retries = 0
    while retries < max_retries:
        token = secrets.token_urlsafe(32)
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    res = db.execute(
                        """
                    INSERT INTO accounts_password_tokens (email, token_text)
                    VALUES (%s, %s)
                    RETURNING token_text;
                    """,
                        [email, token],
                    )

                    row = res.fetchone()
                    if row is None:
                        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Account password token insertion failed unexpectedly")
                    return token
        except UniqueViolation:
            retries += 1
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not generate a unique token after several attempts")


def send_password_reset_email(to_email: str, token: str):
    MAILJET_API_KEY = os.getenv("MAILJET_API_KEY")
    MAILJET_API_SECRET = os.getenv("MAILJET_API_SECRET")

    mailjet: Client
    if MAILJET_API_KEY is not None and MAILJET_API_SECRET is not None:
        mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version="v3.1")
    else:
        raise RuntimeError("MAILJET API credentials are not fully set")

    reset_link = f"{settings.FRONTEND_BASE_URL}/reset-password/{token}"
    data: dict[str, list[dict[str, object]]] = {
        "Messages": [
            {
                "From": {"Email": "noreply@gamergroveapi.com", "Name": "GamerGrove"},
                "To": [{"Email": to_email}],
                "Subject": "Reset your GamerGrove password",
                "TrackClick": "Disabled",
                "HTMLPart": f'<a href="{reset_link}">Reset Password</a>',
            }
        ]
    }
    result = mailjet.send.create(data=data)

    print("Mailjet response status:", result.status_code)
    print("Mailjet response body:", result.json())


@router.post("/api/accounts/forgot_password")
async def forgot_password(reset_email: ResetEmailForm, background_tasks: BackgroundTasks):
    verify_account(reset_email.email)
    token = generate_unique_token(reset_email.email)
    email = reset_email.email
    background_tasks.add_task(send_password_reset_email, email, token)
    return {"message": "Reset email sent if email exists."}


def humanize_timedelta(td: timedelta) -> str:
    days = td.days
    seconds = td.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60

    parts: list[str] = []
    if days:
        parts.append(f"{days} day{'s' if days > 1 else ''}")
    if hours:
        parts.append(f"{hours} hour{'s' if hours > 1 else ''}")
    if minutes:
        parts.append(f"{minutes} minute{'s' if minutes > 1 else ''}")
    if seconds:
        parts.append(f"{seconds} second{'s' if seconds > 1 else ''}")

    return ", ".join(parts) if parts else "0 seconds"


@router.get("/api/accounts/validate_token/{token}")
async def validate_token(token: str) -> dict[str, Any]:
    with pool.connection() as conn:
        with conn.cursor() as db:
            db.execute(
                """
                SELECT email, time_created, used
                FROM accounts_password_tokens
                WHERE token_text = %s;
                """,
                [token],
            )
            row = db.fetchone()

            if not row:
                raise HTTPException(status_code=404, detail="Token not found")

            email, time_created, used = row
            now = datetime.now()

            if used:
                raise HTTPException(status_code=401, detail="Token has already been used")
            if now - time_created >= timedelta(minutes=20):
                raise HTTPException(status_code=401, detail="Token has expired")

            db.execute(
                """
                SELECT * FROM accounts
                WHERE email = %s;
                """,
                [email],
            )

            row = db.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Account associated with email not found")

            if not db.description:
                raise HTTPException(status_code=500, detail="Unexpected: No result description found")

            columns = [desc[0] for desc in db.description]

            account_data: dict[str, Any] = dict(zip(columns, row))

            return {"message": "Token is valid", "account": account_data}


@router.put("/api/accounts/use_token/{token}/{account_id}")
async def use_token(token: str, account_id: int, data: UpdatePasswordForm):
    now = datetime.now()

    with pool.connection() as conn:
        with conn.cursor() as db:
            with conn:
                db.execute("""
                    UPDATE accounts_password_tokens
                    SET used = TRUE
                    WHERE token_text = %s
                    AND used = FALSE
                    AND time_created >= %s
                    RETURNING email;
                """, [token, now - timedelta(minutes=20)])

                row = db.fetchone()
                if not row:
                    raise HTTPException(status_code=401, detail="Invalid, used, or expired token")

                email = row[0]
                hashed_password = authenticator.hash_password(data.new_password) #type: ignore

                db.execute("""
                    UPDATE accounts
                    SET hashed_password = %s
                    WHERE email = %s;
                """, [hashed_password, email])

                db.execute("""
                    UPDATE accounts_password_history
                    SET is_current = FALSE
                    WHERE account_id = %s;
                """, [account_id])

                db.execute("""
                    INSERT INTO accounts_password_history (account_id, hashed_password, is_current)
                    VALUES (%s, %s, %s);
                """, [account_id, hashed_password, True])


                return {"message": "Token marked as used and password updated"}


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
