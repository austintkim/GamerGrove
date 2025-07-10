import os

from authenticator import authenticator
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import accounts, boards, comments, games, icons, libraries, reviews, screenshots, stores, votes
from seederfile import seed_data

load_dotenv()

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


origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://gamergrove.gitlab.io",
    # os.environ.get('CORS_HOST', ''),
    f"http://{os.getenv('EC2_IP_ADDRESS', '')}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
