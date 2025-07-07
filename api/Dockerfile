FROM python:3.10-bullseye

# Install system dependencies (build tools)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, wheel and install Poetry
RUN python -m pip install --upgrade pip setuptools wheel
RUN poetry install --no-root --no-interaction --no-ansi

WORKDIR /app

# Copy only poetry files for dependency install
COPY pyproject.toml poetry.lock* /app/

# Install dependencies (without installing the package itself)
RUN poetry install --no-root --no-dev

# Copy app source code
COPY . /app

# Run migrations and start FastAPI on port 80
CMD ["sh", "-c", "python -m migrations up && poetry run uvicorn main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips '*'"]
