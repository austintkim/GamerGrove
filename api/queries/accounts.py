import os
from psycopg_pool import ConnectionPool
from psycopg import errors
from jwtdown_fastapi.authentication import Token
from pydantic import BaseModel
from typing import Optional
from fastapi import (HTTPException, status)

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


class AccountIn(BaseModel):
    username: str
    password: str
    first_name: str
    last_name: str
    email: str
    icon_id: int


class AccountInUpdate(BaseModel):
    username: str
    password: str
    new_password: Optional[str]
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
    def get_by_id(self, id: int) -> AccountOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM accounts
                    WHERE id = %s;
                    """,
                    [id],
                )

                row = result.fetchone()

                if row is not None:
                    record = {}
                    for i, column in enumerate(db.description):
                        record[column.name] = row[i]
                    return AccountOutWithPassword(**record)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find an account with that id"
                )
    def is_unique(self, field: str, value: str, current_id: int = None) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                if current_id:
                    db.execute(
                        f"""
                        SELECT 1
                        FROM accounts
                        WHERE {field} = %s
                            AND id != %s
                        """,
                        [value, current_id]
                    )
                else:
                    db.execute(
                        f"""
                        SELECT 1 FROM accounts
                        WHERE {field} = %s
                        """,
                        [value]
                    )
                return db.fetchone() is None

    def create(self, data: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        if not self.is_unique("username", data.username) and not self.is_unique("email", data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both the username and email are taken"
            )
        elif not self.is_unique("username", data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That username is taken"
            )
        elif not self.is_unique("email", data.email):
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
                        password_store = db.execute(
                            """
                            INSERT INTO accounts_password_history (account_id, hashed_password)
                            VALUES (%s, %s)
                            RETURNING id, account_id, hashed_password, created_at;
                            """,
                            [
                                row[0],
                                row[2]
                            ]
                        )
                        password_row = password_store.fetchone()

                        if password_row is not None:
                            record = {
                                "id": row[0],
                                "username": row[1],
                                "hashed_password": row[2],
                                "first_name": row[3],
                                "last_name": row[4],
                                "email": row[5],
                                "icon_id": row[6]
                            }
                            return AccountOutWithPassword(**record)

                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail= f'Something went wrong during account creation: {e}'
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

    def passwords_check(self, id: int, current_password: str, new_password: str = None) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                if current_password and new_password:
                    password_check = db.execute(
                        """
                        SELECT 1
                        FROM accounts_password_history
                        WHERE hashed_password = %s
                        AND account_id = %s
                        """,
                        [current_password, id]
                    )
                    new_password_check = db.execute(
                        """
                        SELECT 1
                        FROM accounts_password_history
                        WHERE hashed_password = %s
                        AND account_id = %s
                        """,
                        [new_password, id]
                    )
                    if password_check.fetchone() and not new_password_check.fetchone():
                        return 1
                    elif not password_check.fetchone() and new_password_check.fetchone():
                        return 2
                    elif not password_check.fetchone() and not new_password_check.fetchone():
                        return 3
                    else:
                        return 4
                else:
                    password_check = db.execute(
                        """
                        SELECT 1
                        FROM accounts_password_history
                        WHERE hashed_password = %s
                        AND account_id = %s
                        """,
                        [current_password, id]
                    )
                    if not password_check.fetchone():
                        return 5

    def update(self, id: int, username: str, data: AccountIn, # data: AccountInUpdate
               hashed_password: str #, hashed_new_password: str = None
               ) -> AccountOutWithPassword:
        # detail_messages = {
        #     1: 'Password changed - successful',
        #     2: 'Password changed - previous password incorrect and new password entered before',
        #     3: 'Password changed - new password not entered before but previous password incorrect',
        #     4: 'Password changed - previous password entered correctly but new password entered before',
        #     5: 'Password not changed - current password entered incorrectly'
        # }
        # if not hashed_new_password:
        #     if self.passwords_check(id, hashed_password) == 5:
        #         raise HTTPException(
                    # status_code = status.HTTP_400_BAD_REQUEST,
                    # detail = detail_messages[5]
        #         )
        # else:
            # result = self.passwords_check(id, hashed_password, hashed_new_password)
            # if result > 1:
            #     raise HTTPException(
            #         status_code = status.HTTP_400_BAD_REQUEST,
            #         detail = detail_messages[result]
            #     )

        if not self.is_unique("username", data.username, id) and not self.is_unique("email", data.email, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both the username and email are taken"
            )
        elif not self.is_unique("username", data.username, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That username is taken"
            )
        elif not self.is_unique("email", data.email, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That email is taken"
            )

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
                except Exception:
                    raise HTTPException(
                        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Something went wrong during updating of account"
                    )
