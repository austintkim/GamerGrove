from typing import Union

from fastapi import APIRouter, Depends

from ..queries.stores import HttpError, StoresOut, StoresQueries

router = APIRouter()


@router.get("/api/stores/{rawg_pk}", response_model=Union[list[StoresOut], HttpError])
async def get_store(
    rawg_pk: int,
    queries: StoresQueries = Depends(),
):
    return queries.get_stores(rawg_pk)
