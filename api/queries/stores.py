import logging
import os
from typing import List

import requests
from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

logging.basicConfig(level=logging.DEBUG)

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)
api_key = os.environ.get("API_KEY")


class HttpError(BaseModel):
    detail: str


class StoresIn(BaseModel):
    url: str
    platform: str
    rawg_pk: int


class StoresOut(BaseModel):
    id: int
    url: str
    platform: str
    rawg_pk: int


class StoresNotFoundError(Exception):
    pass


class StoresQueries:
    def get_stores(self, rawg_pk: int) -> List[StoresOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM storesdb
                    WHERE rawg_pk = %s;
                    """,
                    [str(rawg_pk)],
                )
                rows = result.fetchall()
                stores: List[StoresOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        stores.append(StoresOut(**record))
                    return stores

        # If not in DB, fetch from API and store
        api_url = f"https://api.rawg.io/api/games/{rawg_pk}/stores?key={api_key}"
        response = requests.get(api_url)

        if response.status_code == 200:
            external_data = response.json()
            external_stores = external_data.get("results", [])

            if external_stores:
                stores_list: List[StoresOut] = []

                with pool.connection() as conn:
                    with conn.cursor() as cur:
                        for store in external_stores:
                            if store.get("store_id") in [1, 2, 3, 6]:
                                platform = {
                                    1: "PC",
                                    2: "Xbox",
                                    3: "PlayStation",
                                    6: "Nintendo",
                                }.get(store["store_id"], "")

                                cur.execute(
                                    """
                                    INSERT INTO storesdb (platform, url, rawg_pk)
                                    VALUES (%s, %s, %s)
                                    RETURNING id, platform, url, rawg_pk;
                                    """,
                                    [platform, store["url"], rawg_pk],
                                )
                                conn.commit()
                                row = cur.fetchone()
                                if row and cur.description is not None:
                                    record = dict(zip([col.name for col in cur.description], row))
                                    stores_list.append(StoresOut(**record))

                if stores_list:
                    return stores_list

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No stores found in both database and API",
        )
