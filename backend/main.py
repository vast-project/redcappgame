#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from typing import Dict

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse

# from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from settings import host, port, debug

# from settings import static_path

from persistence import persist_object, run_query, generate_debriefing

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # needed for Basic Auth
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount("/static", StaticFiles(directory=static_path), name="static")


@app.post("/persist/{object_name}")
@app.get("/persist/{object_name}")
async def persist_endpoint(object_name: str, request: Request):
    """
Accepts query params for GET requests, and JSON body parameters for POST requests.

The parameters need to be present and complete to form a valid object of the object_name type.

Examples:

Request:

`curl https://redcapp.islab.di.unimi.it/persist/context -H 'Content-Type: application/json' \
-d '{
  "language": "en",
  "age": ">30",
  "gender": "Male",
  "edu_level": "university",
  "nationality": "Bulgarian",
  "user_group_id": "online anonymous",
  "host_organization": "online anonymous participant",
  "user_organization": "UMIL"
}'`

Response:

`{"nationality":"Bulgarian","host_organization":"online anonymous participant","u_id":7,"r_timestamp":"2023-09-21T20:53:23.057657","language":"en","user_group_id":"online anonymous","gender":"Male","activity":"RedCapp","edu_level":"university","user_organization":"UMIL","age":">30","session_id":"97f876be-550c-4fa6-b9b0-e5964007247b"}`


Request:

`curl https://redcapp.islab.di.unimi.it/persist/answer -H 'Content-Type: application/json' -d '{
  "r_code": "xyz",
  "frame_id": "5",
  "story_id": "1",
  "session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7",
  "question_text": "Why?",
  "response_text": "Yes",
  "response_id": "1",
  "response_value": "trust",
  "response_type": "choice"
}'`

Response:

`{"session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7","response_value":"trust","r_id":1,"frame_id":"5","response_text":"Yes","response_type":"choice","r_code":"xyz","r_timestamp":"2023-09-21T20:51:32.182311","story_id":"1","question_text":"Why?","response_id":"1"}`


Request:

`curl https://redcapp.islab.di.unimi.it/persist/evaluation -H 'Content-Type: application/json' \
-d '{
  "score": "5",
  "session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7"
}'`

Response:

`{"e_timestamp":"2023-09-21T20:44:45.336936","e_id":1,"score":"5","session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7"}`

See custom_model.py for more details on the model.
    """
    data = dict(
        request.query_params if request.method == "GET" else await request.json()
    )
    obj = persist_object(object_name, data)
    # gets the class and creates an instance of it
    return obj


@app.post("/query/{query_name}")
@app.get("/query/{query_name}")
async def query_endpoint(query_name: str, request: Request):
    data = dict(
        request.query_params if request.method == "GET" else await request.json()
    )
    obj = run_query(query_name, data)
    print(obj)
    # gets the class and creates an instance of it
    return obj


@app.get("/debrief/{session_id}", response_class=HTMLResponse)
async def debriefing(session_id: str):
    print(session_id)
    result = generate_debriefing(session_id)
    if not result:
        raise HTTPException(status_code=404, detail=f"Session {session_id} not found")
    return result 


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host=host, port=port, reload=True, debug=debug)
