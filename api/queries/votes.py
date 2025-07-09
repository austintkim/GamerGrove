import os
from datetime import datetime
from typing import List

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


class HttpError(BaseModel):
    detail: str


class VoteInBase(BaseModel):
    review_id: int
    upvote: bool


class VoteInUpdate(BaseModel):
    upvote: bool


class VoteIn(VoteInBase):
    account_id: int


class VoteOut(BaseModel):
    id: int
    account_id: int
    review_id: int
    upvote: bool
    date_created: datetime
    last_update: datetime


class VoteQueries:
    def get_user_votes(self, account_id: int) -> List[VoteOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM votes
                    WHERE account_id = %s;
                    """,
                    [account_id],
                )
                rows = result.fetchall()
                votes: List[VoteOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        votes.append(VoteOut(**record))
                    return votes

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No votes by this user",
                )

    def get_review_votes(self, review_id: int) -> List[VoteOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM votes
                    WHERE review_id = %s;
                    """,
                    [review_id],
                )
                rows = result.fetchall()
                votes: List[VoteOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        votes.append(VoteOut(**record))
                    return votes

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="This review doesn't have any votes yet",
                )

    def get_vote(self, id: int) -> VoteOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM votes
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    return VoteOut(
                        id=row[0],
                        account_id=row[1],
                        review_id=row[2],
                        upvote=row[3],
                        date_created=row[4],
                        last_update=row[5],
                    )

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a vote with that id",
                )

    def create_vote(self, vote_dict: VoteIn) -> VoteOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO votes (
                        account_id,
                        review_id,
                        upvote)
                        VALUES (%s, %s, %s)
                        RETURNING id,
                        account_id,
                        review_id,
                        upvote,
                        date_created,
                        last_update
                        """,
                        [
                            vote_dict.account_id,
                            vote_dict.review_id,
                            vote_dict.upvote,
                        ],
                    )
                    row = result.fetchone()
                    if row and db.description is not None:
                        return VoteOut(
                            id=row[0],
                            account_id=row[1],
                            review_id=row[2],
                            upvote=row[3],
                            date_created=row[4],
                            last_update=row[5],
                        )
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to insert vote. No data returned.",
                        )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Error creating vote - {str(e)}",
                    )

    def delete_vote(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM votes
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A vote with that id does not exist in the database",
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM votes
                    WHERE id = %s AND account_id = %s
                    """,
                    [id, account_id],
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete a vote that you did not create",
                    )
                return True

    def update_vote(self, id: int, vote_dict: VoteIn) -> VoteOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM votes
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A vote with that id does not exist in the database",
                    )

                result = db.execute(
                    """
                    UPDATE votes
                    SET upvote = %s
                    WHERE id = %s AND review_id = %s AND account_id = %s
                    RETURNING
                        id,
                        account_id,
                        review_id,
                        upvote,
                        date_created,
                        last_update
                    """,
                    [
                        vote_dict.upvote,
                        id,
                        vote_dict.review_id,
                        vote_dict.account_id,
                    ],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    record = dict(zip([col.name for col in db.description], row))
                    return VoteOut(**record)

                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="You are attempting to update a comment that you did not create",
                )
