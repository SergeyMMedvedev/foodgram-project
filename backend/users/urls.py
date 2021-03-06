from django.urls import path, include
from rest_framework.authtoken import views
from .views import (
    UserCreateAPIView,
    UserView,
    ChangePasswordView,
    reset_password_confirm
)

urlpatterns = [
    path('signin/', views.obtain_auth_token),
    path('signup/', UserCreateAPIView.as_view()),
    path('me/', UserView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
    path('reset-password/confirm/', reset_password_confirm),
    path('reset-password/', include('django_rest_passwordreset.urls',
                                    namespace='password_reset')),
]
