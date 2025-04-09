FROM python:3.10-bullseye

# Install system dependencies (build tools)
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and install wheel
RUN python -m pip install --upgrade pip setuptools wheel

# Sets the working directory inside the container where our app will run
WORKDIR /app

# Copy the necessary files
COPY requirements.txt requirements.txt
COPY main.py main.py
COPY authenticator.py authenticator.py
COPY queries queries
COPY routers routers
COPY seederfile.py seederfile.py
COPY migrations migrations

# Installs all the python packages listed in our requirements.txt file
RUN python -m pip install -r requirements.txt

# Run migrations and start the FastAPI application
CMD ["sh", "-c", "python -m migrations up && uvicorn main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips '*'"]
