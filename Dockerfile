FROM python:3-slim-buster

EXPOSE 8000

RUN apt-get update && apt-get install wget -y && rm -rf /var/lib/apt/lists/*

COPY backend /app

WORKDIR /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN chmod +x main.py
RUN chmod +x model.py

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] #, "--log-level", "debug"]
