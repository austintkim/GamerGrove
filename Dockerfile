FROM python:3.10-bullseye

# Upgrades pip to the latest version
RUN python -m pip install --upgrade pip

# Sets the working directory inside the container where our app will run
WORKDIR /app

# Copy the top-level files in your service's directory
COPY requirements.txt requirements.txt
COPY main.py main.py
COPY authenticator.py authenticator.py
COPY queries queries
COPY routers routers
COPY seederfile.py seederfile.py

# Copy all of the subdirectories in your service's directory
# COPY queries queries
# COPY routers routers

# Installs all the python packages listed in our requirements.txt file
RUN python -m pip install -r requirements.txt

# Copies the migrations directory
COPY migrations migrations

# Expose port 80
EXPOSE 80

# Runs migrations and starts the FastAPI application with uvicorn
CMD python -m migrations up && uvicorn main:app --host 0.0.0.0 --port 80 --forwarded-allow-ips "*"
