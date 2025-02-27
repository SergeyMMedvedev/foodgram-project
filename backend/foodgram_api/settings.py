import os
from django.utils.log import DEFAULT_LOGGING

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'd$o8h-2@&(ejm669sqy(n(ocwxh#oqh6qgm8uorb$@)dm24ssi'

DEBUG = False

ALLOWED_HOSTS = ['*', 'localhost:3000']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_filters',
    'api',
    'corsheaders',
    'rest_framework.authtoken',
    'django_rest_passwordreset',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'foodgram_api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'foodgram_api.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}
BASE_URL = 'http://api.foodgram.students.nomoredomains.icu'
PASSWORD_RESET_URL = 'http://api.foodgram.students.nomoredomains.icu/api/v1/users/reset-password/confirm'

"""
Настройки для локального тестирования
"""
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }
# BASE_URL = 'http://127.0.0.1:8000'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

CORS_URLS_REGEX = r'^/api/.*$'

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://foodgram.students.nomoredomains.icu',
    'http://www.foodgram.students.nomoredomains.icu',
    'http://api.foodgram.students.nomoredomains.icu',
    'http://www.api.foodgram.students.nomoredomains.icu',
    'https://foodgram.students.nomoredomains.icu',
    'https://www.foodgram.students.nomoredomains.icu',
    'https://api.foodgram.students.nomoredomains.icu',
    'https://www.api.foodgram.students.nomoredomains.icu',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],

    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.PageNumberPagination',

    'PAGE_SIZE': 6,
}

DEFAULT_FROM_EMAIL = 'foodgramsmtp@gmail.com'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'foodgramsmtp@gmail.com'
EMAIL_HOST_PASSWORD = 'mzxtA5QcFx3DbZE'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
SERVER_EMAIL = 'foodgramsmtp@gmail.com'

DEFAULT_LOGGING['handlers']['console']['filters'] = []
DEFAULT_LOGGING['loggers'][''] = {
    'handlers': ['console'],
    'level': 'INFO',
    'propagate': True
}

