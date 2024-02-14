import os
from psycopg_pool import ConnectionPool
from pydantic import BaseModel
from typing import List
from fastapi import (HTTPException, status)
import requests
import logging


logging.basicConfig(level=logging.DEBUG)

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))
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
        stores_list = []

        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT *
                        FROM storesdb
                        WHERE rawg_pk = %s;
                        """,
                        [rawg_pk],
                    )
                    rows = cur.fetchall()

                    if rows:
                        for row in rows:
                            record = dict(zip([column.name for column in cur.description], row))
                            stores_list.append(StoresOut(**record))
                        logging.debug("stores from Database: %s", stores_list)

        except Exception as db_error:
            logging.error(db_error)

            api_url = f"https://api.rawg.io/api/games/{rawg_pk}/stores?key={api_key}"
            response = requests.get(api_url)

            if response.status_code == 200:
                external_data = response.json()
                stores = external_data.get("results", [])

                if stores:
                    try:
                        with pool.connection() as conn:
                            with conn.cursor() as cur:
                                good_stores = []
                                for store in stores:
                                    if store.get("store_id") in [1, 2, 3, 6]:
                                        good_stores.append(store)
                                for store in good_stores:
                                    print("these are good stores:", store)
                                    store_url = store.get("url")
                                    store_id = store.get("store_id")
                                    platform = ''
                                    if store_id == 1:
                                        platform = "PC"
                                    elif store_id == 2:
                                        platform = "Xbox"
                                    elif store_id == 3:
                                        platform = "PlayStation"
                                    elif store_id == 6:
                                        platform = "Nintendo"

                                    cur.execute(
                                        """
                                        INSERT INTO storesdb (platform, url, rawg_pk)
                                        VALUES (%s, %s, %s)
                                        RETURNING id, platform, url, rawg_pk;
                                        """,
                                        [platform, store_url, rawg_pk]
                                    )
                                    conn.commit()
                                    row = cur.fetchone()
                                    print("THIS IS THE ROW", row)
                                    if row is not None:
                                        record = dict(zip([column.name for column in cur.description], row))
                                        stores_list.append(StoresOut(**record))

                    except Exception as db_error:
                        logging.error("Error inserting stores into the database: %s", db_error)
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Error adding stores into the database"
                        )

        if not stores_list:
            logging.debug("No stores found in both database and API.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No screenshots found in both database and API"
            )

        logging.debug("Returning stores: %s", stores_list)
        return stores_list
