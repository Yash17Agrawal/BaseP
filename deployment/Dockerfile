# pull the official base image
FROM python:3.13.1-alpine3.21

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# ENV PYTHONDONTWRITEBYTECODE 1 prevents Python from copying pyc files to the container.
# ENV PYTHONUNBUFFERED 1 ensures that Python output is logged to the terminal, making it possible to monitor Django logs in realtime.

# install dependencies
RUN pip install --upgrade pip 
RUN apk update \
    apk add --no-cache postgresql-libs && \
    apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
    apk add python3-dev gcc libc-dev


COPY ./deployment/requirements.txt /usr/src/app
RUN pip install -r requirements.txt

# copy project
COPY . /usr/src/app

EXPOSE 8000

ENTRYPOINT ["sh", "deployment/entrypoint.sh"]