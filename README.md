# file_master_online
Django site for the interactive usage of file_excell_master provided by laboratory

# Project Layout
The project layout reflect the one suggested by Daniel Roy Greenfeld and Audrey Roy Greenfeld in the book "Two Scoops of Django
Best Practices For Django 1.8"
```
<repository_root>/
    <django_project_root>/
        <configuration_root>/
```

Example of suggested layout
```
icecreamratings_project/
    .gitignore
    Makefile
    docs/
    README.rst
    requirements.txt
    icecreamratings/
        manage.py
        media/ # Development ONLY!
        products/
        profiles/
        ratings/
        static/
        templates/
        config/
            __init__.py
            settings/
            urls.py
            wsgi.py
```

# Prerequisites

## Install Postgres 9-6 
```
$ sudo apt-get install postgresql-9.6
```

If you are having problems
```
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main" > /etc/apt/sources.list.d/PostgreSQL.list'
$ sudo apt update
$ sudo apt-get install postgresql-9.6
```

(for more info read https://websiteforstudents.com/installing-postgresql-10-on-ubuntu-16-04-17-10-18-04/)

## Install pip3
```
$ sudo apt -y install python3 python3-pip
```

## Create virtualenv
It is strongly recommended to create a (python3) virtualenv to keep the project isolated, clean and tidy: the versions of libraries that we will install will not conflict with other libraries in other environments.

## Install requirements
```
(venv)$ pip3 install -r requirements.txt
```

## Create database
Log as postgres user and create db with the same db's name of settings.py

```
$ sudo su postgres
postgres=# CREATE DATABASE alfamasterdb;
```

## Django

Apply or unapply migrations

```
(venv)$  python manage.py migrate
```

Collect statics
```
(venv)$  python manage.py collectstatic
```

create superuser django
```
(venv)$  python manage.py createsuperuser
```

# AlfaMaster

To launch the app
```
(venv)$  python manage.py runserver
```

# Custom Commands

Before run `python manage.py runserver` it is advisable to execute the command

```
python manage.py create_folder_logs
```

If the custom command is not executed, running the application will raise an exception if the logs folder is not found