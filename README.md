# foodgram-project
foodgram-project

## Запуск для проверки (ревью, первый этап)

Проект состоит из двух частей:
- frontend
- backend

Для локальной проверки:

 - Находясь в папке backend:
    * ```
      pip install -r requirements.txt
      ```
    * ```
      source venv/Scripts/activate
      ```
    В репозитории есть файл базы данных с тестовыми данными.     
    * ```
      python manage.py makemigrations
      ```
    * ```
      python manage.py migrate
      ```
    * ```
      python manage.py migrate
      ```
    * ```
      python manage.py runserver
      ```     
 
 - После запуска сервера разработки Django, перейти в папку frontend:
    * ```
      npm install  
      ```
    * ```
      npm run start 
      ```