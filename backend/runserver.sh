python3 manage.py collectstatic --noinput
uwsgi --http :8000 --module backend.wsgi