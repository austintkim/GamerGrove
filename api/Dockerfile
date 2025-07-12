FROM python:3.10-bullseye

# Install system dependencies (build tools)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, wheel and install Poetry
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install poetry

# Add docker-compose-wait
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app

ENV POETRY_VIRTUALENVS_CREATE=false

COPY pyproject.toml poetry.lock* /app/
RUN poetry install --no-interaction --no-ansi --no-root

COPY . /app

ENV PYTHONPATH=/app

CMD ["sh", "-c", "/wait && python -m api.migrations up && poetry run uvicorn api.main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips '*'"]
