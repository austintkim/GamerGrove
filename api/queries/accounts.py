import os
from psycopg_pool import ConnectionPool
from psycopg import errors
from jwtdown_fastapi.authentication import Token
from pydantic import BaseModel
from fastapi import (HTTPException, status)

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


class AccountIn(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    icon_id: int


class AccountOut(BaseModel):
    id: int
    username: str
    first_name: str
    last_name: str
    email: str
    icon_id: int


class AccountToken(Token):
    account: AccountOut


class AccountForm(BaseModel):
    username: str
    password: str


class AccountOutWithPassword(AccountOut):
    hashed_password: str


class AccountQueries:
    def get(self, username: str) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE username = %s;
                    """,
                    [username],
                )

                row = result.fetchone()

                if row is not None:
                    record = {}
                    for i, column in enumerate(db.description):
                        record[column.name] = row[i]
                    return AccountOutWithPassword(**record)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find an account with that username"
                )

    def create(self, data: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO accounts (username, hashed_password,
                        first_name, last_name, email, icon_id)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        RETURNING id, username, hashed_password, first_name,
                        last_name, email, icon_id;
                        """,
                        [
                            data.username,
                            hashed_password,
                            data.first_name,
                            data.last_name,
                            data.email,
                            data.icon_id
                        ]
                    )
                    row = result.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        return AccountOutWithPassword(**record)
                except errors.UniqueViolation as e:
                    if "email" in str(e):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="That email is already taken"
                        )
                    elif "username" in str(e):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="That username is already taken"
                        )

    def delete(self, id: int, username: str) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM accounts
                    WHERE id = %s
                    """,
                    [id]
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="An account with that id does not exist in the database"
                    )

                username_check = db.execute(
                    """
                    DELETE FROM accounts
                    WHERE id = %s AND username = %s
                    """,
                    [
                        id,
                        username
                    ]
                )
                if username_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete an account that you did not create"
                    )
                return True

    def update(self, id: int, username: str, data: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    id_check = db.execute(
                        """
                        SELECT * FROM accounts
                        WHERE id = %s
                        """,
                        [id]
                    )
                    id_row = id_check.fetchone()
                    if id_row is None:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail="An account with that id does not exist in the database"
                        )

                    username_check = db.execute(
                        """
                        UPDATE accounts
                        SET username = %s,
                            hashed_password = %s,
                            first_name = %s,
                            last_name = %s,
                            email = %s,
                            icon_id = %s
                        WHERE id = %s AND username = %s
                        """,
                        [
                         data.username,
                         hashed_password,
                         data.first_name,
                         data.last_name,
                         data.email,
                         data.icon_id,
                         id,
                         username
                        ]
                    )

                    if username_check.rowcount == 0:
                        raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="You are attempting to update an account that you did not create"
                        )

                    update_result = db.execute(
                        """
                        SELECT *
                        FROM accounts
                        WHERE username = %s AND hashed_password = %s
                        """,
                        [
                         data.username,
                         hashed_password
                        ]
                    )

                    row = update_result.fetchone()

                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        return AccountOutWithPassword(**record)

                except errors.UniqueViolation as e:
                    if "email" in str(e):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="That email is already taken"
                        )
                    elif "username" in str(e):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="That username is already taken"
                        )
