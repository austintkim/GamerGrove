from fastapi import (APIRouter, Depends, Request, Response)
from typing import Union, List
from queries.games import (
    GameIn,
    GameOut,
    GameQueries,
    HttpError
)


router = APIRouter()


@router.post("/api/games", response_model=Union[GameOut, HttpError])
async def create_game(
    game: GameIn,
    request: Request,
    response: Response,
    queries: GameQueries = Depends(),

):
    game_dict = game.dict()
    created_game = queries.create_game(game_dict)
    return created_game

@router.get("/api/games", response_model=Union[List[GameOut], HttpError])
async def get_all_games(
    queries: GameQueries = Depends()
):
    return queries.get_all_games()

@router.get("/api/games/{id}", response_model=GameOut)
async def get_game(
    id: int,
    queries: GameQueries = Depends(),
):
    return queries.get_game(id)


# @router.delete("/api/games/{id}", response_model=bool)
# async def delete_games(
#     id: int,
#     queries: GamesQueries = Depends(),
# ) -> bool:
#     return queries.delete_games(id)


@router.put("/api/games/{id}", response_model=Union[GameOut, HttpError])
async def update_game(
    id: int,
    game: GameIn,
    queries: GameQueries = Depends(),
):
    game_dict = game.dict()
    updated_game = queries.update_game(id, game_dict)
    return updated_game
