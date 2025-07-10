import os

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)

class IconIn(BaseModel):
    name: str
    icon_url: str


class IconOut(BaseModel):
    id: int
    name: str
    icon_url: str


class IconQueries:
    def get_all_icons(self) -> list[IconOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM icons
                    """
                )
                rows = db.fetchall()
                icons: list[IconOut] = []
                if rows and db.description is not None:
                    for row in rows:
                        record = dict(zip([column.name for column in db.description], row))
                        icons.append(IconOut(**record))
                    return icons

                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find the icons in the database",
                )

    def get_icon(self, id: int) -> IconOut:
        with pool.connection() as conn:
            with conn.cursor() as db:
                result = db.execute(
                    """
                    SELECT *
                    FROM icons
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row is not None and db.description is not None:
                    return IconOut(
                        id=row[0],
                        name=row[1],
                        icon_url=row[2]
                    )
                raise ValueError("Could not get icon")
