FROM python:3.10-bullseye

# Upgrades pip to the latest version
RUN python -m pip install --upgrade pip

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

# Expose the port your application will run on
EXPOSE 8000

# Run migrations and start the FastAPI application
CMD ["sh", "-c", "python -m migrations up && uvicorn main:app --host 0.0.0.0 --port 8000 --forwarded-allow-ips '*'"]
