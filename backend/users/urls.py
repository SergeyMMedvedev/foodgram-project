from django.urls import path
from .views import (
    UserCreateAPIView,
    UserView,
    ChangePasswordView,
    reset_password
)
from rest_framework.authtoken import views

urlpatterns = [
    path('signin/', views.obtain_auth_token),
    path('signup/', UserCreateAPIView.as_view()),
    path('me/', UserView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
    path('reset-password/', reset_password)
]
