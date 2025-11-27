import os
from datetime import datetime, timedelta

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from psycopg_pool import ConnectionPool

from api.authenticator import authenticator
from api.routers import accounts, boards, comments, games, icons, libraries, reviews, screenshots, stores, votes
from api.seederfile import seed_data

load_dotenv()

database_url = os.environ.get("DATABASE_URL")
if database_url is None:
    raise RuntimeError("DATABASE_URL environment variable is not set")

pool = ConnectionPool(conninfo=database_url)

app = FastAPI()
app.include_router(authenticator.router, tags=["AUTH"])
app.include_router(accounts.router, tags=["Accounts"])
app.include_router(boards.router, tags=["Boards"])
app.include_router(games.router, tags=["Games"])
app.include_router(icons.router, tags=["Icons"])
app.include_router(libraries.router, tags=["Libraries"])
app.include_router(screenshots.router, tags=["Screenshots"])
app.include_router(stores.router, tags=["StoresDB"])
app.include_router(reviews.router, tags=["Reviews"])
app.include_router(comments.router, tags=["Comments"])
app.include_router(votes.router, tags=["Votes"])


@app.on_event("startup")
def startup_event():
    seed_data()


def token_cleanup():
    print("************************************")
    print("Token cleanup service initiated")
    print("************************************")
    now = datetime.now()

    with pool.connection() as conn:
        with conn.cursor() as db:
            with conn:
                db.execute(
                    """
                    DELETE FROM accounts_password_tokens WHERE used = TRUE
                    OR time_created >= %s
                    """,
                    [now - timedelta(minutes=20)],
                )
                deleted_rows = db.rowcount
                print("************************************")
                print("Token cleanup service finished")
                print(f"message: {deleted_rows} stale tokens were deleted.")
                print("************************************")


scheduler = BackgroundScheduler()
trigger = CronTrigger(hour=0, minute=0)
scheduler.add_job(token_cleanup, trigger)  # type: ignore
scheduler.start()  # type: ignore

origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://gamergrove.gitlab.io",
    f"http://{os.getenv('EC2_IP_ADDRESS', '')}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
