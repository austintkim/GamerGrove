import os

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)


class HttpError(BaseModel):
    detail: str


class BoardInBase(BaseModel):
    board_name: str
    description: str
    cover_photo: str


class BoardIn(BoardInBase):
    game_count: int
    account_id: int


class BoardOut(BaseModel):
    id: int
    board_name: str
    description: str
    game_count: int
    cover_photo: str
    account_id: int


class BoardQueries:
    def get_board(self, id: int) -> BoardOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM boards
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row is not None and db.description is not None:
                    return BoardOut(
                        id=row[0],
                        board_name=row[1],
                        description=row[2],
                        cover_photo=row[3],
                        game_count=row[4],
                        account_id=row[5],
                    )

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find a board with that id",
                )

    def get_all_boards(self, account_id: int) -> list[BoardOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM boards
                    WHERE account_id = %s;
                    """,
                    [account_id],
                )
                rows = result.fetchall()
                boards: list[BoardOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        boards.append(BoardOut(**record))
                    return boards

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No boards associated with this user",
                )

    def create_board(self, board_dict: BoardIn) -> BoardOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO boards (
                            board_name,
                            description,
                                cover_photo,
                            game_count,
                            account_id)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING
                            id,
                            board_name,
                            description,
                                cover_photo,
                            game_count,
                            account_id
                        """,
                        [
                            board_dict.board_name,
                            board_dict.description,
                            board_dict.cover_photo,
                            board_dict.game_count,
                            board_dict.account_id,
                        ],
                    )
                    row = result.fetchone()
                    if row is not None and db.description is not None:
                        return BoardOut(id=row[0], board_name=row[1], description=row[2], cover_photo=row[3], game_count=row[4], account_id=row[5])
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to insert board. No data returned.",
                        )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Error creating board - {str(e)}",
                    )

    def delete_board(self, id: int, account_id: int) -> bool:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM boards
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A board with that id does not exist in the database",
                    )

                account_id_check = db.execute(
                    """
                    DELETE FROM boards
                    WHERE id = %s AND account_id = %s
                    """,
                    [id, account_id],
                )
                if account_id_check.rowcount == 0:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="You are attempting to delete a board that you did not create",
                    )
                return True

    def update_board(self, id: int, board_dict: BoardIn) -> BoardOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                id_check = db.execute(
                    """
                    SELECT * FROM boards
                    WHERE id = %s
                    """,
                    [id],
                )

                id_row = id_check.fetchone()
                if id_row is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="A board with that id does not exist in the database",
                    )

                result = db.execute(
                    """
                    UPDATE boards
                    SET board_name = %s,
                        description = %s,
                        cover_photo = %s,
                        game_count = %s
                    WHERE id = %s AND account_id = %s
                    RETURNING
                        id,
                        board_name,
                        description,
                        cover_photo,
                        game_count,
                        account_id;
                    """,
                    [
                        board_dict.board_name,
                        board_dict.description,
                        board_dict.cover_photo,
                        board_dict.game_count,
                        id,
                        board_dict.account_id,
                    ],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    record = dict(zip([col.name for col in db.description], row))
                    return BoardOut(**record)

                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="You are attempting to update a board that you did not create",
                )
