import logging
import os

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


class ScreenshotsInBase(BaseModel):
    image_url: str


class ScreenshotsIn(ScreenshotsInBase):
    rawg_pk: int


class ScreenshotsOut(BaseModel):
    id: int
    image_url: str
    rawg_pk: int


class ScreenshotsNotFoundError(Exception):
    pass


class ScreenshotsQueries:
    def get_screenshots(self, rawg_pk: int) -> list[ScreenshotsOut]:
        screenshots_list: list[ScreenshotsOut] = []

        try:
            screenshots_list.extend(self.retrieve_screenshots_from_database(rawg_pk))
        except Exception as db_error:
            logging.error(
                "Error retrieving screenshots from the database: %s", db_error
            )

        if not screenshots_list:
            screenshots_list.extend(self.retrieve_screenshots_from_api(rawg_pk))

        if not screenshots_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No screenshots found in both database and API",
            )

        return screenshots_list

    def retrieve_screenshots_from_database(self, rawg_pk: int) -> list[ScreenshotsOut]:
        screenshots_list: list[ScreenshotsOut] = []

        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    db.execute(
                        """
                        SELECT *
                        FROM screenshots
                        WHERE rawg_pk = %s;
                        """,
                        [str(rawg_pk)],
                    )
                    rows = db.fetchall()

                    if rows and db.description is not None:
                        for row in rows:
                            record = dict(
                                zip([column.name for column in db.description], row)
                            )
                            screenshots_list.append(ScreenshotsOut(**record))
                        logging.debug("Screenshots from Database: %s", screenshots_list)

        except Exception as db_error:
            logging.error(
                "Error retrieving screenshots from the database: %s", db_error
            )

        return screenshots_list

    def retrieve_screenshots_from_api(self, rawg_pk: int) -> list[ScreenshotsOut]:
        screenshots_list: list[ScreenshotsOut] = []

        api_url = f"https://api.rawg.io/api/games/{rawg_pk}/screenshots?key={api_key}"
        response = requests.get(api_url)

        if response.status_code == 200:
            external_data = response.json()
            screenshots = external_data.get("results", [])

            if screenshots:
                try:
                    with pool.connection() as conn:
                        with conn.cursor() as db:
                            for screenshot in screenshots:
                                image_url = screenshot.get("image")

                                db.execute(
                                    """
                                    SELECT id
                                    FROM screenshots
                                    WHERE image_url = %s::text;
                                    """,
                                    [image_url],
                                )
                                existing_image = db.fetchone()

                                if existing_image:
                                    continue

                                db.execute(
                                    """
                                    INSERT INTO screenshots (image_url, rawg_pk)
                                    VALUES (%s, %s)
                                    RETURNING id, image_url, rawg_pk;
                                    """,
                                    [image_url, rawg_pk],
                                )

                                row = db.fetchone()
                                if row and db.description is not None:
                                    record = dict(
                                        zip(
                                            [column.name for column in db.description],
                                            row,
                                        )
                                    )
                                    screenshots_list.append(ScreenshotsOut(**record))
                except Exception as db_error:
                    logging.error(
                        "Error inserting screenshots into the database: %s", db_error
                    )

        return screenshots_list
