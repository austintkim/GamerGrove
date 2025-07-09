import os
from datetime import datetime
from typing import Any, List

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


class HttpError(BaseModel):
    detail: str


class ReviewInBase(BaseModel):
    title: str
    body: str
    game_id: int
    rating: float


class ReviewInUpdate(BaseModel):
    title: str
    body: str
    rating: float


class ReviewIn(ReviewInBase):
    comment_count: int
    upvote_count: int
    account_id: int


class ReviewOut(BaseModel):
    id: int
    game_id: int
    account_id: int
    username: str
    title: str
    body: str
    comment_count: int
    upvote_count: int
    rating: float
    date_created: datetime
    last_update: datetime


class ReviewQueries:
    def get_game_reviews(self, game_id: int) -> List[ReviewOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM reviews
                    WHERE game_id = %s;
                    """,
                    [game_id],
                )
                rows = db.fetchall()
                reviews: List[ReviewOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        reviews.append(ReviewOut(**record))
                    return reviews

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No reviews associated with this game",
                )

    def get_review(self, id: int) -> ReviewOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM reviews
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    return ReviewOut(
                       id=row[0],
                       body=row[1],
                       title=row[2],
                       account_id=row[3],
                       username=row[4],
                       game_id=row[5],
                       comment_count=row[6],
                       upvote_count=row[7],
                       rating=row[8],
                       date_created=row[9],
                       last_update=row[10]
                    )

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a review with that id",
                )

    def get_user_reviews(self, account_id: int) -> List[ReviewOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM reviews
                    WHERE account_id = %s;
                    """,
                    [account_id],
                )
                rows = db.fetchall()
                reviews: List[ReviewOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        reviews.append(ReviewOut(**record))
                    return reviews

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No reviews written by this user",
                )

    def create_review(self, username: str, review_dict: ReviewIn) -> ReviewOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO reviews (
                            game_id,
                            account_id,
                            username,
                            body,
                            title,
                            rating,
                            comment_count,
                            upvote_count
                            )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING
                            id,
                            game_id,
                            account_id,
                            username,
                            body,
                            title,
                            rating,
                            comment_count,
                            upvote_count,
                            date_created,
                            last_update
                        """,
                        [
                            review_dict.game_id,
                            review_dict.account_id,
                            username,
                            review_dict.body,
                            review_dict.title,
                            review_dict.rating,
                            review_dict.comment_count,
                            review_dict.upvote_count,
                        ],
                    )
                    row = result.fetchone()
                    if row and db.description is not None:
                        return ReviewOut(
                            id=row[0],
                            body=row[1],
                            title=row[2],
                            account_id=row[3],
                            username=row[4],
                            game_id=row[5],
                            comment_count=row[6],
                            upvote_count=row[7],
                            rating=row[8],
                            date_created=row[9],
                            last_update=row[10],
                        )
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to insert review. No data returned.",
                        )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Error creating review - {str(e)}",
                    )

    def delete_review(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM reviews
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A review with that id does not exist in the database",
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM reviews
                    WHERE id = %s AND account_id = %s
                    """,
                    [id, account_id],
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete a review that you did not create",
                    )
                return True

    def update_review(self, id: int, username: str, review_dict: ReviewIn) -> ReviewOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM reviews
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None or db.description is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A review with that id does not exist in the database",
                    )

                columns = [desc[0] for desc in db.description]
                existing_review = dict(zip(columns, id_row))

                update_fields: List[Any] = []
                update_values: List[Any] = []

                if review_dict.title != existing_review["title"]:
                    update_fields.append("title = %s")
                    update_values.append(review_dict.title)

                if review_dict.body != existing_review["body"]:
                    update_fields.append("body = %s")
                    update_values.append(review_dict.body)

                if review_dict.rating != existing_review["rating"]:
                    update_fields.append("rating = %s")
                    update_values.append(review_dict.rating)

                update_fields.append("comment_count = %s")
                update_values.append(review_dict.comment_count)

                update_fields.append("upvote_count = %s")
                update_values.append(review_dict.upvote_count)

                if (
                    "title = %s" in update_fields
                    or "body = %s" in update_fields
                    or "rating = %s" in update_fields
                ):
                    update_fields.append("last_update = CURRENT_TIMESTAMP")

                update_query = f"""
                    UPDATE reviews
                    SET {", ".join(update_fields)}
                    WHERE id = %s AND game_id = %s AND account_id = %s AND username = %s
                    RETURNING id, game_id, account_id, username, body, title, rating,
                            comment_count, upvote_count, date_created, last_update
                """

                update_values.extend(
                    [
                        id,
                        review_dict.game_id,
                        review_dict.account_id,
                        username,
                    ]
                )

                result = db.execute(update_query, update_values)
                row = result.fetchone()

                if row is not None:
                    columns = [desc[0] for desc in db.description]
                    record = dict(zip(columns, row))

                    record["game_id"] = int(record["game_id"])
                    record["account_id"] = int(record["account_id"])
                    record["comment_count"] = int(record["comment_count"])
                    record["upvote_count"] = int(record["upvote_count"])
                    record["rating"] = float(record["rating"])

                    return ReviewOut(**record)
                else:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to update a review that you did not create",
                    )
