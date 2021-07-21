# foodgram
[![yamdb_final workflow](https://github.com/SergeyMMedvedev/foodgram-project/workflows/foodgram%20workflow/badge.svg)](https://github.com/SergeyMMedvedev/yamdb_final/actions?query=workflow%3A%22yamdb_final+workflow%22)

[![GitHub%20Actions](https://img.shields.io/badge/-GitHub%20Actions-464646??style=flat-square&logo=GitHub%20actions)](https://github.com/features/actions)
[![GitHub](https://img.shields.io/badge/-GitHub-464646??style=flat-square&logo=GitHub)](https://github.com/)
[![docker](https://img.shields.io/badge/-Docker-464646??style=flat-square&logo=docker)](https://www.docker.com/)
[![NGINX](https://img.shields.io/badge/-NGINX-464646??style=flat-square&logo=NGINX)](https://nginx.org/ru/)
[![Python](https://img.shields.io/badge/-Python-464646??style=flat-square&logo=Python)](https://www.python.org/)
[![Django](https://img.shields.io/badge/-Django-464646??style=flat-square&logo=Django)](https://www.djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-464646??style=flat-square&logo=PostgreSQL)](https://www.postgresql.org/)
[![JavaScript](https://img.shields.io/badge/-JavaScript-464646??style=flat-square&logo=javascript)](https://www.javascript.com/)
[![React](https://img.shields.io/badge/-react-464646??style=flat-square&logo=react)](https://ru.reactjs.org/)
[![CSS](https://img.shields.io/badge/-CSS-464646??style=flat-square&logo=css3)](https://www.w3.org/Style/CSS/specs.ru.html)
[![HTML](https://img.shields.io/badge/-HTML-464646??style=flat-square&logo=HTML5)](https://www.w3.org/TR/html52/introduction.html#introduction)

Foodgram - Это онлайн-сервис, где пользователи смогут публиковать рецепты, 
подписываться на публикации других пользователей, 
добавлять понравившиеся рецепты в список «Избранное», 
а перед походом в магазин скачивать сводный список продуктов, 
необходимых для приготовления одного или нескольких выбранных блюд.


## Начало

Клонирование проекта:
```
git clone https://github.com/SergeyMMedvedev/foodgram-project.git
```

## Запуск для проверки

Проект состоит из двух частей:
- frontend
- backend

На сервере фронтенд и бекэнд на разных поддоменах:

* Фронтенд
  - http://foodgram.students.nomoredomains.icu
  - http://www.foodgram.students.nomoredomains.icu
* Бекэнд
  - http://api.foodgram.students.nomoredomains.icu
  - http://www.api.foodgram.students.nomoredomains.icu

Для локальной проверки:

**Доступ к админке:**
* **username: admin**
* **password: admin@admin.com**

 - Находясь в папке backend:
    * ```
      docker-compose up 
      ```
- Находясь в папке frontend:
    * Если проверять работу фронтенда с базой данных в локально развернутом контйнере, то 
    необходимо поменять URL в frontend/src/utils/constants.js на:
        
    ```
    ULR для Postgresql при локальном разворачивании контейнеров
    export const API_BASE_URL = 'http://127.0.0.1/api/v1';
    ```
    * Если проверять работу фронтенда с базой данных сервера, то оставить текущий url
    
    Запуск готовой сборки фронтенда
    * ```
      serve -s backend/build
      ```

    Установка зависимостей:
    * ```
      npm install  
      ```
    Запустить сервер фронтенда:
    * ```
      npm run start 
      ```
    Сборка фронтенда:
    * ```
      npm run buildToBackend
      ```

До первого запуска на сервере необходимо добавить файл .env.

Для добавления файла .env с настройками базы данных на сервер необходимо:

* Установить соединение с сервером по протоколу ssh:
    ```
    ssh username@server_address
    ```
    Где username - имя пользователя, под которым будет выполнено подключение к серверу.
    
    server_address - IP-адрес сервера или доменное имя.
    
    Например:
    ```
    ssh praktikum@84.201.178.66
  
    ```
* В домашней директории проекта
    Создать папку www/:
    ```
    mkdir www
    ```
    В ней создать папку foodgram-project/:
    ```
    mkdir www/foodgram-project
    ```
    В папке foodgram-project создать файл .env:
    ```
    touch www/foodgram-project/.env
    ```

* Добавить настройки в файл .env:
    ```
    sudo nano www/foodgram-project/.env
    ```
    Пример добавляемых настроек:
    ```
    DB_ENGINE=django.db.backends.postgresql
    DB_NAME=postgres
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    DB_HOST=postgres
    DB_PORT=5432
    ```

Также необходимо добавить Action secrets в репозитории на GitHub в разделе settings -> Secrets:
* DOCKER_PASSWORD - пароль от DockerHub;
* DOCKER_USERNAME - имя пользователя на DockerHub;
* HOST - ip-адрес сервера;
* SSH_KEY - приватный ssh ключ (публичный должен быть на сервере);
* TELEGRAM_TO - id своего телеграм-аккаунта (можно узнать у @userinfobot, команда /start)
* TELEGRAM_TOKEN - токен бота (получить токен можно у @BotFather, /token, имя бота)


### Проверка работоспособности

Теперь если внести любые изменения в проект и выполнить:
```
git add .
git commit -m "..."
git push
```
Комманда git push является триггером workflow проекта.
При выполнении команды git push запустится набор блоков комманд jobs (см. файл main.yaml).
Последовательно будут выполнены следующие блоки:
* tests - тестирование проекта на соответствие PEP8.
* build_and_push_to_docker_hub - при успешном прохождении тестов собирается образ (image) для docker контейнера 
и отправлятеся в DockerHub
* deploy - после отправки образа на DockerHub начинается деплой проекта на сервере.
Происходит копирование следующих файлов с репозитория на сервер:
  - docker-compose.yaml, необходимый для сборки трех контейнеров:
    + postgres - контейнер базы данных
    + web - контейнер Django приложения + wsgi-сервер gunicorn
    + nginx - веб-сервер
  - nginx/default.conf - файл кофигурации nginx сервера
  - static - папка со статическими файлами проекта
  
  После копировния происходит установка docker и docker-compose на сервере
  и начинается сборка и запуск контейнеров.
* send_message - после сборки и запуска контейнеров происходит отправка сообщения в 
  телеграм об успешном окончании workflow

После выполнения вышеуказанных процедур необходимо установить соединение с сервером:
```
ssh username@server_address
```
Отобразить список работающих контейнеров:
```
sudo docker container ls
```
В списке контейнеров копировать CONTAINER ID контейнера username/foodgram:lastest (username - имя пользователя на DockerHub):
```
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                NAMES
0361a982109d   nginx:1.19.6                     "/docker-entrypoint.…"   50 minutes ago   Up 50 minutes   0.0.0.0:80->80/tcp   yamdb_final_nginx_1
a47ce31d4b7b   username/foodgram:lastest        "/bin/sh -c 'gunicor…"   50 minutes ago   Up 50 minutes                        yamdb_final_web_1
aed19f6751f3   postgres:13.1                    "docker-entrypoint.s…"   50 minutes ago   Up 50 minutes   5432/tcp             yamdb_final_postgres_1
```
Выполнить вход в контейнер:
```
sudo docker exec -it a47ce31d4b7b bash
```
Внутри контейнера выполнить миграции:
```
python manage.py migrate
```
Также можно наполнить базу данных начальными тестовыми данными:
```
python3 manage.py shell
>>> from django.contrib.contenttypes.models import ContentType
>>> ContentType.objects.all().delete()
>>> quit()
python manage.py loaddata fixtures.json
```
Теперь проекту доступна статика. В админке Django (http://<server_address>/admin)
доступно управление данными. Если загрузить фикструры, то будет доступен superuser:
* email: admin
* password: admin@admin.com

Для создания нового суперпользователя можно выполнить команду:
```
$ python manage.py createsuperuser
```
и далее указать: 
```
Email:
Username:
Password:
Password (again):
```

Для изменения допустимого размера добавляемых фотографий:

Отобразить список работающих контейнеров:
```
sudo docker container ls
```
В списке контейнеров копировать CONTAINER ID контейнера nginx:1.19.6:
```
CONTAINER ID   IMAGE                            COMMAND                  CREATED          STATUS          PORTS                NAMES
0361a982109d   nginx:1.19.6                     "/docker-entrypoint.…"   50 minutes ago   Up 50 minutes   0.0.0.0:80->80/tcp   yamdb_final_nginx_1
a47ce31d4b7b   username/foodgram:lastest        "/bin/sh -c 'gunicor…"   50 minutes ago   Up 50 minutes                        yamdb_final_web_1
aed19f6751f3   postgres:13.1                    "docker-entrypoint.s…"   50 minutes ago   Up 50 minutes   5432/tcp             yamdb_final_postgres_1
```
Выполнить вход в контейнер:
```
sudo docker exec -it 0361a982109d bash
```
Внутри контейнера устанавливаем пакеты для редактирования:
```
apt update
apt install sudo
apt install nano
```
Заходим в файл конфигурации:
```
sudo nano /etc/nginx/nginx.conf
```
Добавляем в концигурацию "client_max_body_size 5M":
```
http {
    client_max_body_size 5M; <-- добавляем

    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    ...
```
Перрезапускаем nginx:
```
nginx -s reload
```
Выход из контейнера:
```
ctrl+ D
```

## Автор

* **Сергей Медведев** - [SergeyMMedvedev](https://github.com/SergeyMMedvedev)
