import os
from typing import Optional

from fastapi import HTTPException, status
from jwtdown_fastapi.authentication import Token
from psycopg import sql
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


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


class AccountInDelete(BaseModel):
    password: str


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


class ResetEmailForm(BaseModel):
    email: str

class UpdatePasswordForm(BaseModel):
    new_password: str


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

                if row is not None and db.description is not None:
                    return AccountOutWithPassword(
                        id=row[0],
                        username=row[1],
                        hashed_password=row[2],
                        first_name=row[3],
                        last_name=row[4],
                        email=row[5],
                        icon_id=row[6],
                    )

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find an account with that username",
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

                if row is not None and db.description is not None:
                    return AccountOutWithPassword(
                        id=row[0],
                        username=row[1],
                        hashed_password=row[2],
                        first_name=row[3],
                        last_name=row[4],
                        email=row[5],
                        icon_id=row[6],
                    )
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find an account with that id",
                )

    def is_unique(self, field: str, value: str, current_id: Optional[int] = None) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                if current_id is not None:
                    query = sql.SQL(
                        """
                        SELECT 1
                        FROM accounts
                        WHERE {} = %s
                        AND id != %s
                        """
                    ).format(sql.Identifier(field))
                    db.execute(query, [value, current_id])
                else:
                    query = sql.SQL(
                        """
                        SELECT 1
                        FROM accounts
                        WHERE {} = %s
                        """
                    ).format(sql.Identifier(field))
                    db.execute(query, [value])
                return db.fetchone() is None

    def create(self, data: AccountIn, hashed_password: str) -> AccountOutWithPassword:
        if not self.is_unique("username", data.username) and not self.is_unique("email", data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both the username and email are taken",
            )
        elif not self.is_unique("username", data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That username is taken",
            )
        elif not self.is_unique("email", data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That email is taken",
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
                            data.icon_id,
                        ],
                    )
                    row = result.fetchone()
                    if row is None:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Account insertion failed unexpectedly",
                        )

                    password_store = db.execute(
                        """
                        INSERT INTO accounts_password_history (account_id, hashed_password, is_current)
                        VALUES (%s, %s, %s)
                        RETURNING id, account_id, hashed_password, is_current, created_at;
                        """,
                        [row[0], row[2], True],
                    )
                    password_row = password_store.fetchone()
                    if password_row is None:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to store password history for the account.",
                        )

                    return AccountOutWithPassword(
                        id=row[0],
                        username=row[1],
                        hashed_password=row[2],
                        first_name=row[3],
                        last_name=row[4],
                        email=row[5],
                        icon_id=row[6],
                    )

                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Something went wrong during account creation: {e}",
                    )

    def delete(
        self,
        id: int,
        username: str,
        data: AccountInDelete,
    ) -> bool:
        from api.authenticator import authenticator

        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM accounts
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="An account with that id does not exist in the database",
                    )

                db.execute(
                    """
                    SELECT hashed_password
                    FROM accounts_password_history
                    WHERE account_id = %s AND is_current = True
                    """,
                    [id],
                )
                current_pw_row = db.fetchone()
                if current_pw_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Something went wrong with checking the inputted password - check FastAPI container logs",
                    )

                password_check = authenticator.verify_password(data.password, current_pw_row[0])
                if not password_check:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Incorrect password - account could not be deleted",
                    )

                username_check = db.execute(
                    """
                    DELETE FROM accounts
                    WHERE id = %s AND username = %s
                    """,
                    [id, username],
                )
                if username_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete an account that you did not create",
                    )

                return True

    def passwords_check(
        self,
        id: int,
        username: str,
        current_password: str,
        new_password: Optional[str] = None,
    ) -> int:
        from api.authenticator import authenticator

        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                        SELECT * FROM accounts
                        WHERE id = %s
                        """,
                    [id],
                )
                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="An account with that id does not exist in the database",
                    )

                username_check = db.execute(
                    """
                    SELECT * FROM accounts
                    WHERE id = %s AND username = %s
                    """,
                    [id, username],
                )
                username_row = username_check.fetchone()
                if username_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to update an account that you did not create",
                    )

                db.execute(
                    """
                    SELECT hashed_password
                    FROM accounts_password_history
                    WHERE account_id = %s AND is_current = TRUE
                    """,
                    [id],
                )
                current_pw_row = db.fetchone()
                current_pw_valid = False
                if current_pw_row:
                    current_pw_valid = authenticator.verify_password(current_password, current_pw_row[0])

                new_pw_used = False
                if new_password:
                    db.execute(
                        """
                        SELECT hashed_password
                        FROM accounts_password_history
                        WHERE account_id = %s
                        """,
                        [id],
                    )
                    all_pw_rows = db.fetchall()
                    new_pw_used = any(authenticator.verify_password(new_password, row[0]) for row in all_pw_rows)

                if current_password and new_password:
                    if current_pw_valid and not new_pw_used:
                        return 1
                    elif not current_pw_valid and new_pw_used:
                        return 2
                    elif not current_pw_valid and not new_pw_used:
                        return 3
                    else:
                        return 4
                else:
                    if current_pw_valid:
                        return 5
                    else:
                        return 6

    def update(self, id: int, username: str, data: AccountInUpdate) -> AccountOutWithPassword:
        if not self.is_unique("username", data.username, id) and not self.is_unique("email", data.email, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both the username and email are taken",
            )
        elif not self.is_unique("username", data.username, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That username is taken",
            )
        elif not self.is_unique("email", data.email, id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That email is taken",
            )

        detail_messages = {
            1: "Password changed - successful",
            2: "Password changed - previous password incorrect and new password entered before",
            3: "Password changed - new password not entered before but previous password incorrect",
            4: "Password changed - previous password entered correctly but new password entered before",
            5: "Password not changed - successful",
            6: "Password not changed - current password entered incorrectly",
        }

        result = self.passwords_check(id, username, data.password, data.new_password)

        if result == 1:
            from api.authenticator import authenticator

            with pool.connection() as conn:
                with conn.cursor() as db:
                    try:
                        db.execute(
                            """
                            UPDATE accounts_password_history
                            SET is_current = FALSE
                            WHERE account_id = %s AND is_current = TRUE;
                            """,
                            [id],
                        )
                        hashed_pw = authenticator.hash_password(data.new_password)  # type: ignore

                        db.execute(
                            """
                            INSERT INTO accounts_password_history
                            (account_id, hashed_password, is_current)
                            VALUES(%s, %s, TRUE);
                            """,
                            [id, hashed_pw],
                        )

                        update = db.execute(
                            """
                            UPDATE accounts
                            SET
                                username = %s,
                                hashed_password = %s,
                                first_name = %s,
                                last_name = %s,
                                email = %s,
                                icon_id = %s
                            WHERE
                                id = %s AND username = %s
                            RETURNING
                                id,
                                username,
                                hashed_password,
                                first_name,
                                last_name,
                                email,
                                icon_id;
                            """,
                            [
                                data.username,
                                hashed_pw,
                                data.first_name,
                                data.last_name,
                                data.email,
                                data.icon_id,
                                id,
                                username,
                            ],
                        )
                        update_row = update.fetchone()

                        if update_row is not None:
                            record = {
                                "id": update_row[0],
                                "username": update_row[1],
                                "hashed_password": update_row[2],
                                "first_name": update_row[3],
                                "last_name": update_row[4],
                                "email": update_row[5],
                                "icon_id": update_row[6],
                            }
                            return AccountOutWithPassword(**record)
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to update account — no row returned.",
                            )
                    except Exception as e:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong during account updating: {e}",
                        )
        elif result == 5:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    try:
                        update = db.execute(
                            """
                            UPDATE accounts
                            SET
                                username = %s,
                                first_name = %s,
                                last_name = %s,
                                email = %s,
                                icon_id = %s
                            WHERE
                                id = %s AND username = %s
                            RETURNING
                                id,
                                username,
                                hashed_password,
                                first_name,
                                last_name,
                                email,
                                icon_id;
                            """,
                            [
                                data.username,
                                data.first_name,
                                data.last_name,
                                data.email,
                                data.icon_id,
                                id,
                                username,
                            ],
                        )
                        update_row = update.fetchone()

                        if update_row is not None:
                            record = {
                                "id": update_row[0],
                                "username": update_row[1],
                                "hashed_password": update_row[2],
                                "first_name": update_row[3],
                                "last_name": update_row[4],
                                "email": update_row[5],
                                "icon_id": update_row[6],
                            }
                            return AccountOutWithPassword(**record)
                        else:
                            raise HTTPException(
                                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail="Failed to update account — no row returned.",
                            )
                    except Exception as e:
                        raise HTTPException(
                            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=f"Something went wrong during account updating: {e}",
                        )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{result}: {detail_messages[result]}",
            )
