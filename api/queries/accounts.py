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

    def is_unique(self, field: str, value: str) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    f"""
                    SELECT 1 FROM accounts WHERE {field} = %s
                    """,
                    [value]
                )
                return db.fetchone() is None

    def create(self, data: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        uniqueness_violations = set()
        if not self.is_unique("username", data.username):
            uniqueness_violations.add(1)

        if not self.is_unique("email", data.email):
            uniqueness_violations.add(2)

        if len(uniqueness_violations) == 2:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both the username and email are taken"
            )
        elif 1 in uniqueness_violations:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That username is taken"
            )
        elif 2 in uniqueness_violations:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That email is taken"
            )

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
                except Exception:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Something went wrong during account creation"
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
