#!/bin/bash

# Activate your virtual environment if you have one
# source /path/to/your/venv/bin/activate

echo "Starting Celery worker..."

# Run the Celery worker
# -A tasks: Specifies the Celery app instance (found in tasks.py)
# worker: Command to start a worker process
# --loglevel=info: Set the logging level (debug, info, warning, error, critical)
# -P eventlet: Use eventlet for concurrency (optional, install with `pip install eventlet`)
#             Alternatively use gevent (`pip install gevent`) or prefork (default)
celery -A tasks worker --loglevel=info
# celery -A tasks worker --loglevel=info -P eventlet -c 10 # Example with eventlet and 10 concurrent workers

echo "Celery worker stopped."
