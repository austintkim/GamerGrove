from fastapi import (APIRouter, Depends, Response)
from typing import Union, List
from authenticator import authenticator
from queries.boards import (
    BoardInBase,
    BoardOut,
    BoardQueries,
    HttpError
)

router = APIRouter()


@router.post("/api/boards", response_model=Union[BoardOut, HttpError])
async def create_board(
    board: BoardInBase,
    queries: BoardQueries = Depends(),
    # Dependency injection which 1. protects this endpoint and makes it only accessible
    # to a user that has a JWT from logging in 2. gets the currently logged in user's
    # account data using a built-in jwtdown_fast api authenticator method
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    # Extracting account id from Pydantic object that we converted into a Python dictionary
    # on line 21 and storing in a variable
    account_id = account_data["id"]
    # Converting BoardInBase user input object into a Python dictionary using .dict(_)
    board_dict = board.dict()
    # Manually inserting a game_count key with a default value of 0 into input object
    board_dict["game_count"] = 0
    # Manually inserting an account_id key with a value of the account_id we extracted
    # on line 25
    board_dict["account_id"] = account_id

    # Passing this input dictionary into query function which will actually create a
    # board object, insert it into the database, and return the dictionary as a Pydantic
    # object which matches the shape of the BoardOut Pydantic model
    created_board = queries.create_board(board_dict)
    return created_board


@router.get("/api/boards/{id}", response_model=BoardOut)
async def get_board(
    id: int,
    queries: BoardQueries = Depends(),
):
    return queries.get_board(id)


@router.get("/api/boards/users/{account_id}", response_model=Union[List[BoardOut], HttpError])
async def get_all_boards(
    queries: BoardQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = account_data["id"]
    return queries.get_all_boards(account_id)


@router.delete("/api/boards/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_board(
    id: int,
    queries: BoardQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    account_id = account_data["id"]
    return queries.delete_board(id, account_id)


@router.put("/api/boards/{id}/{account_id}", response_model=Union[BoardOut, HttpError])
async def update_board(
    id: int,
    board: BoardInBase,
    response: Response,
    queries: BoardQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    board_details = queries.get_board(id).dict()

    account_id = account_data["id"]
    game_count = board_details["game_count"]

    board_dict = board.dict()
    board_dict["account_id"] = account_id
    board_dict["game_count"] = game_count

    updated_board = queries.update_board(id, board_dict)
    return updated_board
