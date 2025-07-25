import os
from datetime import datetime
from typing import Optional

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


class HttpError(BaseModel):
    detail: str


class CommentInBase(BaseModel):
    body: str
    review_id: int
    comment_id: Optional[int]


class CommentInUpdate(BaseModel):
    body: str


class CommentIn(CommentInBase):
    account_id: int


class CommentOut(BaseModel):
    id: int
    account_id: int
    body: str
    review_id: int
    comment_id: Optional[int]
    date_created: datetime
    last_update: datetime


class CommentQueries:
    def get_user_comments(self, account_id: int) -> list[CommentOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM comments
                    WHERE account_id = %s;
                    """,
                    [account_id],
                )
                rows = result.fetchall()
                comments: list[CommentOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        comments.append(CommentOut(**record))
                    return comments

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No comments written by this user",
                )

    def get_review_comments(self, review_id: int) -> list[CommentOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM comments
                    WHERE review_id = %s;
                    """,
                    [review_id],
                )
                rows = result.fetchall()
                comments: list[CommentOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        comments.append(CommentOut(**record))
                    return comments

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="This review doesn't have any comments yet",
                )

    def get_comment(self, id: int) -> CommentOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM comments
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    return CommentOut(id=row[0], body=row[1], account_id=row[2], review_id=row[3], comment_id=row[4], date_created=row[5], last_update=row[6])

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a comment with that id",
                )

    def create_comment(self, comment_dict: CommentIn) -> CommentOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO comments (
                        account_id,
                        review_id,
                        comment_id,
                        body)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id,
                        account_id,
                        review_id,
                        comment_id,
                        body,
                        date_created,
                        last_update
                        """,
                        [comment_dict.account_id, comment_dict.review_id, comment_dict.comment_id, comment_dict.body],
                    )
                    row = result.fetchone()
                    if row and db.description is not None:
                        return CommentOut(
                            id=row[0],
                            body=row[1],
                            account_id=row[2],
                            review_id=row[3],
                            comment_id=row[4],
                            date_created=row[5],
                            last_update=row[6],
                        )
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to insert comment. No data returned.",
                        )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Error creating comment - {str(e)}",
                    )

    def delete_comment(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM comments
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A comment with that id does not exist in the database",
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM comments
                    WHERE id = %s AND account_id = %s
                    """,
                    [id, account_id],
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete a comment that you did not create",
                    )
                return True

    def update_comment(self, id: int, comment_dict: CommentIn) -> CommentOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM comments
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A comment with that id does not exist in the database",
                    )
                result = db.execute(
                    """
                    UPDATE comments
                    SET body = %s
                    WHERE id = %s AND review_id = %s AND (comment_id IS NULL OR comment_id = %s) AND account_id = %s
                    RETURNING
                        id,
                        review_id,
                        comment_id,
                        account_id,
                        body,
                        date_created,
                        last_update
                    """,
                    [
                        comment_dict.body,
                        id,
                        comment_dict.review_id,
                        comment_dict.comment_id,
                        comment_dict.account_id,
                    ],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    record = dict(zip([col.name for col in db.description], row))
                    return CommentOut(**record)

                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="You are attempting to update a comment that you did not create",
                )
