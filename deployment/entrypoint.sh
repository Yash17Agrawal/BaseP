#!/bin/sh

# RUN python manage.py collectstatic --noinput
# pip install pillow
python manage.py migrate
python manage.py runserver 0.0.0.0:8000