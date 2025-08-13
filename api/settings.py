import os


class Settings:
    ENV = os.getenv("ENV", "development")
    FRONTEND_BASE_URL = "http://localhost:5173" if ENV == "development" else "https://gamergrove.gitlab.io/gamer-grove"


settings = Settings()
