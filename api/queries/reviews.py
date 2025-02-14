import os
from psycopg_pool import ConnectionPool
from typing import List
from pydantic import BaseModel
from fastapi import (HTTPException, status)
from datetime import datetime

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


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
                reviews = []
                if rows:
                    record = {}
                    for row in rows:
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        reviews.append(ReviewOut(**record))
                    return reviews

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No reviews associated with this game"
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
                    [id]
                )
                row = result.fetchone()
                if row is not None:
                    records = {}
                    for i, column in enumerate(db.description):
                        records[column.name] = row[i]
                    return ReviewOut(**records)

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a review with that id"
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
                reviews = []
                if rows:
                    for row in rows:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        reviews.append(ReviewOut(**record))
                    return reviews

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No reviews written by this user"
                )

    def create_review(self, review_dict: ReviewIn) -> ReviewOut:
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
                            review_dict["game_id"],
                            review_dict["account_id"],
                            review_dict["username"],
                            review_dict["body"],
                            review_dict["title"],
                            review_dict["rating"],
                            review_dict["comment_count"],
                            review_dict["upvote_count"]
                        ],
                    )
                    row = result.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        return ReviewOut(**record)
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Error creating review"
                    )

    def delete_review(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM reviews
                    WHERE id = %s
                    """,
                    [id]
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A review with that id does not exist in the database"
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM reviews
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
                        detail="You are attempting to delete a review that you did not create"
                    )
                return True

    def update_review(self, id: int, review_dict: ReviewIn) -> ReviewOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM reviews
                    WHERE id = %s
                    """,
                    [id]
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A review with that id does not exist in the database"
                    )

                columns = [desc[0] for desc in db.description]
                existing_review = dict(zip(columns, id_row))

                update_fields = []
                update_values = []

                if review_dict["body"] != existing_review["body"]:
                    update_fields.append("body = %s")
                    update_values.append(review_dict["body"])

                if review_dict["title"] != existing_review["title"]:
                    update_fields.append("title = %s")
                    update_values.append(review_dict["title"])

                update_fields.append("rating = %s")
                update_values.append(review_dict["rating"])

                update_fields.append("comment_count = %s")
                update_values.append(review_dict["comment_count"])

                update_fields.append("upvote_count = %s")
                update_values.append(review_dict["upvote_count"])

                if "body = %s" in update_fields or "title = %s" in update_fields:
                    update_fields.append("last_update = CURRENT_TIMESTAMP")

                update_query = f"""
                    UPDATE reviews
                    SET {", ".join(update_fields)}
                    WHERE id = %s AND game_id = %s AND account_id = %s AND username = %s
                    RETURNING id, game_id, account_id, username, body, title, rating,
                            comment_count, upvote_count, date_created, last_update
                """

                update_values.extend([id, review_dict["game_id"], review_dict["account_id"], review_dict["username"]])

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
                        detail="You are attempting to update a review that you did not create"
                    )
