# FairyTaleCard
A card-based interactive narrative with a sample on the Little Red Riding Hood.
Story structure: https://docs.google.com/spreadsheets/d/1uKHRDo3_efzncO3GDvNLWEMiRTjgEUP407Ck4JQm840
Impex scripts: https://github.com/umilISLab/redcapp

Contains generic endpoint `/persist/<object_name>` with model in [backend/model.py] served both as POST (data in request body) and GET (data in URL parameters) requests.

# Documentation

Consider assets available here: https://drive.google.com/drive/u/0/folders/107zu17Mk-E5Wo4jQ_TjtKM4KLA2bgbWR

Examples for communication with local persistence DB:

## Init context

Request:

`curl https://redcapp.islab.di.unimi.it/persist/context -H 'Content-Type: application/json' -d '{
  "r_code": "xyz",
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

`{"nationality":"Bulgarian","host_organization":"online anonymous participant","u_id":7,"r_timestamp":"2023-09-21T20:53:23.057657+00:00","language":"en","user_group_id":"online anonymous","gender":"Male","activity":"RedCapp","r_code":"xyz","edu_level":"university","user_organization":"UMIL","age":">30","session_id":"97f876be-550c-4fa6-b9b0-e5964007247b", "story_file": "redcapTaleEnglish.json"}`

## Submit choice

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

`{"session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7","response_value":"trust","r_id":1,"frame_id":"5","response_text":"Yes","response_type":"choice","r_code":"xyz","r_timestamp":"2023-09-21T20:51:32.182311+00:00","story_id":"1","question_text":"Why?","response_id":"1"}`

## Submit evaluation

Request:

`curl https://redcapp.islab.di.unimi.it/persist/evaluation -H 'Content-Type: application/json' -d '{
  "score": "5",
  "session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7"
}'`

Response:

`{"e_timestamp":"2023-09-21T20:44:45.336936+00:00","e_id":1,"score":"5","session_id":"6db8aa01-6fce-4818-8536-e02159bdbba7"}`

## Request debriefing

Request:

`curl https://redcapp.islab.di.unimi.it/debrief/97f876be-550c-4fa6-b9b0-e5964007247b`

Response:

`Grazie per aver partecipato al progetto VAST. Il tuo contributo è molto importante per noi.
Nelle tue risposte hai dato importanza a valori diversi senza che uno sia prevalente rispetto agli altri.
Hanno partecipato a questa attività 31 utenti.
Le risposte raccolte fino ad ora mostrano una prevalenza del seguente valore: Sincerity`


# Backend startup

1. Make sure docker-compose is installed

2. Build front-end with `npm install && npm run build`

3. Run containers with `docker-compose up --build`

4. Once containers are up, in a separate terminal run `docker exec -it fairytalecard-fastapi-1 /app/model.py` to initialise database.
