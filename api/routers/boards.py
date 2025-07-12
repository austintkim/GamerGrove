from typing import Any, Union

from fastapi import APIRouter, Depends

from api.authenticator import authenticator

from ..queries.boards import BoardIn, BoardInBase, BoardOut, BoardQueries, HttpError

router = APIRouter()


@router.post("/api/boards", response_model=Union[BoardOut, HttpError])
async def create_board(
    board: BoardInBase,
    queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    account_id = account_data["id"]
    board_dict = board.dict()
    board_dict["game_count"] = 0
    board_dict["account_id"] = account_id

    board_in = BoardIn(**board_dict)

    created_board = queries.create_board(board_in)
    return created_board


@router.get("/api/boards/{id}", response_model=BoardOut)
async def get_board(
    id: int,
    queries: BoardQueries = Depends(),
):
    return queries.get_board(id)


@router.get("/api/boards/users/{account_id}", response_model=Union[list[BoardOut], HttpError])
async def get_all_boards(
    queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    account_id = account_data["id"]
    return queries.get_all_boards(account_id)


@router.delete("/api/boards/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_board(
    id: int,
    queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    account_id = account_data["id"]
    return queries.delete_board(id, account_id)


@router.put("/api/boards/{id}/{account_id}", response_model=Union[BoardOut, HttpError])
async def update_board(
    id: int,
    board: BoardInBase,
    queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    board_details = queries.get_board(id).dict()

    account_id = account_data["id"]
    game_count = board_details["game_count"]

    board_dict = board.dict()
    board_dict["account_id"] = account_id
    board_dict["game_count"] = game_count

    board_in = BoardIn(**board_dict)

    updated_board = queries.update_board(id, board_in)
    return updated_board
