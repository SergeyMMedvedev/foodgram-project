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
    В репозитории есть файл базы данных с тестовыми данными.     

    * ```
      python manage.py runserver
      ```     
    Суперпользователь:
    * name: admin
    * password: admin@admin.com
 - После запуска сервера разработки Django, перейти в папку frontend:
    * ```
      npm install  
      ```
    * ```
      npm run start 
      ```