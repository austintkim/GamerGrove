import os
from datetime import date
from typing import List

from fastapi import HTTPException, status
from psycopg import errors
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


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
                games = []
                if rows:
                    record = {}
                    for row in rows:
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
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
                if row is not None:
                    record = {}
                    for i, column in enumerate(db.description):
                        record[column.name] = row[i]
                    return GameOut(**record)

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could find a game with that id",
                )

    def create_game(self, game_dict: GameIn) -> GameOut:
        description = game_dict["description"]
        if "<p>" not in description[:3]:
            description = "<p>" + description + "</p>"
            game_dict["description"] = description

        with pool.connection() as conn:
            with conn.cursor() as cur:
                try:
                    result = cur.execute(
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
                            game_dict["name"],
                            game_dict["description"],
                            game_dict["rating"],
                            game_dict["dates"],
                            game_dict["background_img"],
                            game_dict["Xbox"],
                            game_dict["PlayStation"],
                            game_dict["Nintendo"],
                            game_dict["PC"],
                            game_dict["rating_count"],
                            game_dict["rating_total"],
                            game_dict["genre"],
                            game_dict["developers"],
                            game_dict["rawg_pk"],
                            game_dict["reviews_count"],
                        ],
                    )

                    row = result.fetchone()
                    if row is not None:
                        record = {}
                        for i, column in enumerate(cur.description):
                            record[column.name] = row[i]
                        return GameOut(**record)
                    if ValueError:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Error creating game",
                        )
                except errors.UniqueViolation:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="That game already exists in the database",
                    )

    def update_game(self, id: int, games_dict: GameIn) -> GameOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                try:
                    db.execute(
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
                            games_dict["name"],
                            games_dict["description"],
                            games_dict["rating"],
                            games_dict["dates"],
                            games_dict["background_img"],
                            games_dict["xbox"],
                            games_dict["playstation"],
                            games_dict["nintendo"],
                            games_dict["pc"],
                            games_dict["rating_count"],
                            games_dict["rating_total"],
                            games_dict["genre"],
                            games_dict["developers"],
                            games_dict["rawg_pk"],
                            games_dict["reviews_count"],
                            id,
                        ],
                    )
                    return GameOut(id=id, **games_dict)
                except ValueError:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Error updating game",
                    )
