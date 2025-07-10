from typing import Union

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from queries.icons import IconOut, IconQueries


class HttpError(BaseModel):
    detail: str


router = APIRouter()


@router.get("/api/icons", response_model=Union[list[IconOut], HttpError])
async def get_all_icons(queries: IconQueries = Depends()):
    return queries.get_all_icons()


@router.get("/api/icons/{id}", response_model=Union[IconOut, HttpError])
async def get_icon(id: int, queries: IconQueries = Depends()):
    return queries.get_icon(id)
