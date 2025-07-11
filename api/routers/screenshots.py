from typing import Union

from fastapi import APIRouter, Depends

from ..queries.screenshots import HttpError, ScreenshotsOut, ScreenshotsQueries

router = APIRouter()


@router.get("/api/screenshots/{rawg_pk}", response_model=Union[list[ScreenshotsOut], HttpError])
async def get_screenshots(
    rawg_pk: int,
    queries: ScreenshotsQueries = Depends(),
):
    return queries.get_screenshots(rawg_pk)
