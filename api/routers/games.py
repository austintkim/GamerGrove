from typing import Union

from fastapi import APIRouter, Depends

from ..queries.games import GameIn, GameOut, GameQueries, GamesList, HttpError

router = APIRouter()


@router.post("/api/games", response_model=Union[GameOut, HttpError])
async def create_game(
    game: GameIn,
    queries: GameQueries = Depends(),
):
    game_dict = game.dict()

    game_in = GameIn(**game_dict)

    created_game = queries.create_game(game_in)
    return created_game


@router.get("/api/games", response_model=Union[GamesList, HttpError])
async def get_all_games(queries: GameQueries = Depends()):
    return {"games": queries.get_all_games()}


@router.get("/api/games/{id}", response_model=GameOut)
async def get_game(
    id: int,
    queries: GameQueries = Depends(),
):
    return queries.get_game(id)


@router.put("/api/games/{id}", response_model=Union[GameOut, HttpError])
async def update_game(
    id: int,
    game: GameIn,
    queries: GameQueries = Depends(),
):
    game_dict = game.dict()

    game_in = GameIn(**game_dict)

    updated_game = queries.update_game(id, game_in)
    return updated_game
