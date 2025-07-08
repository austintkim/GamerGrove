import os
from typing import List

from fastapi import HTTPException, status
from psycopg_pool import ConnectionPool
from pydantic import BaseModel

pool = ConnectionPool(conninfo=os.environ.get("DATABASE_URL"))


class IconIn(BaseModel):
    name: str
    icon_url: str


class IconOut(BaseModel):
    id: int
    name: str
    icon_url: str


class IconQueries:
    def get_all_icons(self) -> List[IconOut]:
        with pool.connection() as conn:
            with conn.cursor() as db:
                db.execute(
                    """
                    SELECT *
                    FROM icons
                    """
                )
                rows = db.fetchall()
                icons = []
                if rows:
                    record = {}
                    for row in rows:
                        for i, column in enumerate(db.description):
                            record[column.name] = row[i]
                        icons.append(IconOut(**record))
                    return icons
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Could not find the icons in the database",
                )

    def get_icon(self, id: int) -> IconOut:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    SELECT *
                    FROM icons
                    WHERE id = %s;
                    """,
                    [id],
                )
                row = result.fetchone()
                if row is not None:
                    record = {}
                    for i, column in enumerate(cur.description):
                        record[column.name] = row[i]
                    return IconOut(**record)
                raise ValueError("Could not get icon")
