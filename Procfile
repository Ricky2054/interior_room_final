web: gunicorn -k uvicorn.workers.UvicornWorker server_interior:app --bind 0.0.0.0:$PORT
worker: gunicorn -k uvicorn.workers.UvicornWorker text2image:app --bind 0.0.0.0:$PORT 