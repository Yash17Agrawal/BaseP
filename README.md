# BaseP

## Prerequisites

* Python 3   -  (Not mandatory to install)
* Virtualenv -  To enable referencing library code while development (Not mandatory to install)
* docker 
* docker-compose

## Server Setup

1. Go to project root i.e BaseP
2. docker-compose -f deployment/docker-compose.yml up
3. Go to localhost:8000 for app
4. Go to localhost:8000/admin for app
5. Go to localhost:5050 for pgmyadmin for managing postgres