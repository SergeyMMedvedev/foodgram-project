from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)

from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
)
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import (
    IsAuthenticated
)
from django.shortcuts import get_object_or_404


User = get_user_model()


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"old_password": ["неверный пароль."]},
                                status=status.HTTP_400_BAD_REQUEST)
            new_password = serializer.data.get("new_password")
            new_password_again = serializer.data.get("new_password_again")
            if new_password == old_password:
                return Response(
                    {
                        "new_password":
                            ["старый пароль не отличается от нового"]},
                        status=status.HTTP_400_BAD_REQUEST
                )
            if new_password == new_password_again:
                self.object.set_password(serializer.data.get("new_password"))
                self.object.save()
                response = {
                    'status': 'success',
                    'code': status.HTTP_200_OK,
                    'message': 'пароль успешно изменен',
                    'data': []
                }

                return Response(response)
            else:
                return Response({"new_password":
                                     ["новый пароль не подтвержден"]},
                                status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserView(RetrieveAPIView):
    model = User
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ]
    queryset = User.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        user = get_object_or_404(queryset,
                                 auth_token=self.request.user.auth_token)
        return user


class UserCreateAPIView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        token, created = Token.objects.get_or_create(
            user_id=response.data["id"])
        response.data["token"] = str(token)
        return response


@api_view(http_method_names=['POST'])
@permission_classes((IsAuthenticated, ))
def reset_password(request):
    user_email = request.data.get('email')
    if not user_email:
        return Response({'email': 'это поле обязательно.'},
                        status=status.HTTP_400_BAD_REQUEST)
    user = get_object_or_404(User, email=user_email)

    mail_subject = 'Activate your account.'
    message = (f"you are: {user}\n"
               f"password: {user.password}")
    to_email = str(user_email)
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()
    return Response({'email': f"сообщение отправлено на {to_email}"},
                    status=status.HTTP_200_OK)

