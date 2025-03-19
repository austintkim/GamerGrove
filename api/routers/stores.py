from fastapi import (APIRouter, Depends)
from typing import Union
from queries.stores import (
    StoresOut,
    StoresQueries,
    HttpError
)
from typing import List

router = APIRouter()


@router.get("/api/stores/{rawg_pk}", response_model=Union[List[StoresOut], HttpError])
async def get_store(
    rawg_pk: int,
    queries: StoresQueries = Depends(),
):
    return queries.get_stores(rawg_pk)
