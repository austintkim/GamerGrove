import os
from psycopg_pool import ConnectionPool
from typing import List, Optional
from pydantic import BaseModel
from fastapi import (HTTPException, status)

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


class HttpError(BaseModel):
    detail: str


class ReplyInBase(BaseModel):
    body: str
    review_id: int
    reply_id: Optional[int]


class ReplyInUpdate(BaseModel):
    body: str


class ReplyIn(ReplyInBase):
    account_id: int


class ReplyOut(BaseModel):
    id: int
    body: str
    review_id: int
    reply_id: Optional[int]
    account_id: int


class ReplyQueries:
    def get_user_replies(self, account_id: int) -> List[ReplyOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM replies
                    WHERE account_id = %s;
                    """,
                    [account_id]
                )
                rows = result.fetchall()
                replies = []
                if rows:
                    for row in rows:
                        data = {}
                        for i, column in enumerate(db.description):
                            data[column.name] = row[i]
                        replies.append(ReplyOut(**data))
                    return replies

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No replies written by this user"
                )

    def get_review_replies(self, review_id: int) -> List[ReplyOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM replies
                    WHERE review_id = %s;
                    """,
                    [review_id]
                )
                rows = result.fetchall()
                replies = []
                if rows:
                    records = {}
                    for row in rows:
                        for i, column in enumerate(db.description):
                            records[column.name] = row[i]
                        replies.append(ReplyOut(**records))
                    return replies

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="This review doesn't have any replies yet"
                )

    def get_reply(self, id: int) -> ReplyOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM replies
                    WHERE id = %s;
                    """,
                    [id]
                )
                row = result.fetchone()
                if row:
                    records = {}
                    for i, column in enumerate(db.description):
                        records[column.name] = row[i]
                    return ReplyOut(**records)

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a reply with that id"
                )

    def create_reply(self, reply_dict: ReplyIn) -> ReplyOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO replies (body,
                        account_id,
                        review_id,
                        reply_id,
                        body)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id,
                        account_id,
                        review_id,
                        reply_id,
                        body;
                        """,
                        [
                            reply_dict["account_id"],
                            reply_dict["review_id"],
                            reply_dict["reply_id"],
                            reply_dict["body"]
                        ]
                    )
                    row = result.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        return ReplyOut(**record)
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Error creating reply"
                    )

    def delete_reply(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM replies
                    WHERE id = %s
                    """,
                    [id]
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A reply with that id does not exist in the database"
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM replies
                    WHERE id = %s AND account_id = %s
                    """,
                    [
                        id,
                        account_id
                    ]
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete a reply that you did not create"
                    )
                return True

    def update_reply(self, id: int, reply_dict: ReplyIn) -> ReplyOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM replies
                    WHERE id = %s
                    """,
                    [id]
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A reply with that id does not exist in the database"
                    )
                account_id_check = db.execute(
                    """
                    UPDATE replies
                    SET body = %s
                    WHERE id = %s AND review_id = %s AND reply_id = %s AND account_id = %s
                    """,
                    [
                        reply_dict["body"],
                        id,
                        reply_dict["review_id"],
                        reply_dict["reply_id"],
                        reply_dict["account_id"]
                    ]
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to update a reply that you did not create"
                    )
                return ReplyOut(id=id, **reply_dict)
