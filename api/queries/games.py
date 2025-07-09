import os
from datetime import date
from typing import List

from fastapi import HTTPException, status
from psycopg import errors
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)

class HttpError(BaseModel):
    detail: str


class GameIn(BaseModel):
    name: str
    description: str
    rating: float
    dates: date
    background_img: str
    Xbox: bool
    PlayStation: bool
    Nintendo: bool
    PC: bool
    rating_count: float
    rating_total: float
    genre: str
    developers: str
    rawg_pk: int
    reviews_count: int


class GameOut(BaseModel):
    id: int
    name: str
    description: str
    rating: float
    dates: date
    background_img: str
    xbox: bool
    playstation: bool
    nintendo: bool
    pc: bool
    rating_count: float
    rating_total: float
    genre: str
    developers: str
    rawg_pk: int
    reviews_count: int


class GamesList(BaseModel):
    games: list[GameOut]


class GameQueries:
    def get_all_games(self) -> List[GameOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM gamesdb
                    """
                )
                rows = db.fetchall()
                games: List[GameOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(
                            zip([column.name for column in db.description], row)
                            )
                        games.append(GameOut(**record))
                    return games
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find the games in the database",
                )

    def get_game(self, id: int) -> GameOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM gamesdb
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row is not None and db.description is not None:
                    return GameOut(
                        id=row[0],
                        name=row[1],
                        description=row[2],
                        rating=row[3],
                        dates=row[4],
                        background_img=row[5],
                        xbox=row[6],
                        playstation=row[7],
                        nintendo=row[8],
                        pc=row[9],
                        rating_count=row[10],
                        rating_total=row[11],
                        genre=row[12],
                        developers=row[13],
                        rawg_pk=row[14],
                        reviews_count=row[15]
                    )

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could find a game with that id",
                )

    def create_game(self, game_dict: GameIn) -> GameOut:
        description = game_dict.description
        if "<p>" not in description[:3]:
            description = "<p>" + description + "</p>"
            game_dict.description = description

        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    result = db.execute(
                        """
                        INSERT INTO gamesdb (
                        name,
                        description,
                        rating,
                        dates,
                        background_img,
                        Xbox,
                        PlayStation,
                        Nintendo,
                        PC,
                        rating_count,
                        rating_total,
                        genre,
                        developers,
                        rawg_pk,
                        reviews_count)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        RETURNING *;
                        """,
                        [
                            game_dict.name,
                            game_dict.description,
                            game_dict.rating,
                            game_dict.dates,
                            game_dict.background_img,
                            game_dict.Xbox,
                            game_dict.PlayStation,
                            game_dict.Nintendo,
                            game_dict.PC,
                            game_dict.rating_count,
                            game_dict.rating_total,
                            game_dict.genre,
                            game_dict.developers,
                            game_dict.rawg_pk,
                            game_dict.reviews_count,
                        ],
                    )

                    row = result.fetchone()
                    if row is not None and db.description is not None:
                        return GameOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            rating=row[3],
                            dates=row[4],
                            background_img=row[5],
                            xbox=row[6],
                            playstation=row[7],
                            nintendo=row[8],
                            pc=row[9],
                            rating_count=row[10],
                            rating_total=row[11],
                            genre=row[12],
                            developers=row[13],
                            rawg_pk=row[14],
                            reviews_count=row[15]
                        )
                    else:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to insert game. No data returned.",
                        )
                except Exception as e:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Error creating game - {str(e)}",
                    )

    def update_game(self, id: int, game_dict: GameIn) -> GameOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    UPDATE gamesdb
                    SET name = %s,
                        description = %s,
                        rating = %s,
                        dates = %s,
                        background_img = %s,
                        Xbox = %s,
                        PlayStation = %s,
                        Nintendo = %s,
                        PC = %s,
                        rating_count = %s,
                        rating_total = %s,
                        genre = %s,
                        developers = %s,
                        rawg_pk = %s,
                        reviews_count = %s
                    WHERE id = %s
                    """,
                    [
                        game_dict.name,
                        game_dict.description,
                        game_dict.rating,
                        game_dict.dates,
                        game_dict.background_img,
                        game_dict.Xbox,
                        game_dict.PlayStation,
                        game_dict.Nintendo,
                        game_dict.PC,
                        game_dict.rating_count,
                        game_dict.rating_total,
                        game_dict.genre,
                        game_dict.developers,
                        game_dict.rawg_pk,
                        game_dict.reviews_count,
                        id,
                    ],
                )
                row = result.fetchone()
                if row and db.description is not None:
                    record = dict(zip([col.name for col in db.description], row))
                    return GameOut(id=id, **record)

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="A game with that id does not exist in the database",
                )
