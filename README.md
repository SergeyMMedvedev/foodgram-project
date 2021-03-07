# foodgram-project
foodgram-project

## Запуск для проверки (ревью, первый этап)

Проект состоит из двух частей:
- frontend
- backend

Для локальной проверки:

 - Находясь в папке backend:
    * ```
      python -m venv venv  
      ```
    * ```
      source venv/Scripts/activate
      ```      
    * ```
      pip install -r requirements.txt
      ```
    Из репозитория также возьмется файл базы данных с тестовыми данными.
    
    Далее запуск сервера.     

    * ```
      python manage.py runserver
      ```     
    Уже созданный суперпользователь:
    * name: admin
    * password: admin@admin.com
 - После запуска сервера разработки Django, перейти в папку frontend:
    
    Установить зависимости:
    * ```
      npm install  
      ```
    Запустить сервер фронтенда:
    * ```
      npm run start 
      ```