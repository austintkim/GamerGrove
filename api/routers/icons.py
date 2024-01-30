from fastapi import (
    APIRouter, Depends
)
from typing import Union, List
from queries.icons import (
    IconOut,
    IconQueries
)

from pydantic import BaseModel

class HttpError(BaseModel):
    detail:str

router = APIRouter()

@router.get("/api/icons", response_model=Union[List[IconOut], HttpError])
async def get_all_icons(
    queries: IconQueries = Depends()
):
    return queries.get_all_icons()

@router.get("/api/icons/{id}", response_model=Union[IconOut, HttpError])
async def get_icon(
    id: int,
    queries: IconQueries = Depends()
):
    return queries.get_icon(id)
