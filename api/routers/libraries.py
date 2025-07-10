from typing import Any, Union

from authenticator import authenticator
from fastapi import APIRouter, Depends
from queries.boards import (
    BoardIn,
    BoardQueries,
)
from queries.libraries import (
    HttpError,
    LibraryIn,
    LibraryInBase,
    LibraryOut,
    LibraryQueries,
)

router = APIRouter()


@router.post("/api/libraries", response_model=Union[LibraryOut, HttpError])
async def create_library_entry(
    entry: LibraryInBase,
    queries: LibraryQueries = Depends(),
    board_queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    account_id = account_data["id"]
    library_dict = entry.dict()

    board_id = library_dict["board_id"]

    if board_id is not None:
        board_dict = board_queries.get_board(board_id).dict()
        del board_dict["id"]
        board_dict["game_count"] += 1

        board_in = BoardIn(**board_dict)
        board_queries.update_board(board_id, board_in)

    library_dict["account_id"] = account_id

    library_in = LibraryIn(**library_dict)

    created_entry = queries.create_library_entry(library_in)
    return created_entry


@router.get(
    "/api/users/libraries/{account_id}",
    response_model=Union[list[LibraryOut], HttpError],
)
async def get_library(
    queries: LibraryQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    account_id = account_data["id"]
    return queries.get_library(account_id)


@router.get("/api/libraries/{id}", response_model=Union[LibraryOut, HttpError])
async def get_library_entry(
    id: int,
    queries: LibraryQueries = Depends(),
):
    return queries.get_library_entry(id)


@router.delete(
    "/api/libraries/{id}/{account_id}", response_model=Union[bool, HttpError]
)
async def delete_library_entry(
    id: int,
    queries: LibraryQueries = Depends(),
    board_queries: BoardQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type:ignore
):
    library_details = queries.get_library_entry(id).dict()
    board_id = library_details["board_id"]

    if board_id is not None:
        board_dict = board_queries.get_board(board_id).dict()
        del board_dict["id"]
        board_dict["game_count"] -= 1

        board_in = BoardIn(**board_dict)
        board_queries.update_board(board_id, board_in)

    account_id = account_data["id"]
    return queries.delete_library_entry(id, account_id)
