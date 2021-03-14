from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import (
    validate_password,
    get_password_validators
)
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.dispatch import receiver
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _

from django_rest_passwordreset.models import (
    ResetPasswordToken,
    clear_expired,
    get_password_reset_token_expiry_time,
    get_password_reset_lookup_field
)
from django_rest_passwordreset.serializers import (
    EmailSerializer,
    PasswordTokenSerializer,
)
from django_rest_passwordreset.signals import (
    reset_password_token_created,
    pre_password_reset,
    post_password_reset
)

from rest_framework import status, exceptions
from rest_framework.authtoken.models import Token
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    UpdateAPIView,
    GenericAPIView
)
from rest_framework.permissions import (
    IsAuthenticated
)
from rest_framework.response import Response

from .email_message import get_reset_password_email_message
from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
)

User = get_user_model()

__all__ = [
    'UserView',
    'UserCreateAPIView',
    'ChangePasswordView',
    'ResetPasswordValidateToken',
    'ResetPasswordConfirm',
    'ResetPasswordRequestToken',
    'reset_password_validate_token',
    'reset_password_confirm',
    'reset_password_request_token'
]


class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get('old_password')
            if not obj.check_password(old_password):
                return Response({'old_password': ['неверный пароль.']},
                                status=status.HTTP_400_BAD_REQUEST)
            new_password = serializer.data.get('new_password')
            new_password_again = serializer.data.get('new_password_again')
            if new_password == old_password:
                return Response(
                    {
                        'new_password':
                            ['старый пароль не отличается от нового']},
                        status=status.HTTP_400_BAD_REQUEST
                )
            if new_password == new_password_again:
                obj.set_password(serializer.data.get('new_password'))
                obj.save()
                response = {
                    'status': 'success',
                    'code': status.HTTP_200_OK,
                    'message': 'пароль успешно изменен',
                    'data': []
                }

                return Response(response)
            else:
                return Response({
                    'new_password': ['новый пароль не подтвержден']},
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
            user_id=response.data['id'])
        response.data['token'] = str(token)
        return response


# Сброс пароля

HTTP_USER_AGENT_HEADER = getattr(
    settings,
    'DJANGO_REST_PASSWORDRESET_HTTP_USER_AGENT_HEADER',
    'HTTP_USER_AGENT'
)

HTTP_IP_ADDRESS_HEADER = getattr(
    settings,
    'DJANGO_REST_PASSWORDRESET_IP_ADDRESS_HEADER',
    'REMOTE_ADDR'
)


class ResetPasswordValidateToken(GenericAPIView):
    throttle_classes = ()
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'status': 'OK'})


class ResetPasswordConfirm(GenericAPIView):
    throttle_classes = ()
    permission_classes = ()
    serializer_class = PasswordTokenSerializer

    def get(self, request, *args, **kwargs):
        token = request.query_params.get('token')
        password = get_random_string(12)
        reset_password_token = ResetPasswordToken.objects.filter(
            key=token).first()

        if not reset_password_token:
            return HttpResponse(
                'ссылка не действительна',
                content_type='text/plain; charset=utf-8',
            )

        eligible_for_reset = reset_password_token.user.eligible_for_reset()
        if eligible_for_reset:

            pre_password_reset.send(
                sender=self.__class__, user=reset_password_token.user
            )
            try:
                validate_password(
                    password,
                    user=reset_password_token.user,
                    password_validators=get_password_validators(
                        settings.AUTH_PASSWORD_VALIDATORS
                    )
                )
            except ValidationError as e:
                raise exceptions.ValidationError({
                    'password': e.messages
                })

            reset_password_token.user.set_password(password)
            reset_password_token.user.save()
            post_password_reset.send(
                sender=self.__class__, user=reset_password_token.user
            )
        ResetPasswordToken.objects.filter(
            user=reset_password_token.user
        ).delete()
        mail_subject = 'New password.'
        message = f'Ваш новый пароль: {password}'
        to_email = str(reset_password_token.user.email)
        email = EmailMessage(mail_subject, message, to=[to_email])
        email.send()

        return HttpResponse(
            'на вашу почту был отправлен новый пароль',
            content_type='text/plain; charset=utf-8',
        )


class ResetPasswordRequestToken(GenericAPIView):
    throttle_classes = ()
    permission_classes = ()
    serializer_class = EmailSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        password_reset_token_validation_time = \
            get_password_reset_token_expiry_time()

        now_minus_expiry_time = timezone.now() - timedelta(
            hours=password_reset_token_validation_time)

        clear_expired(now_minus_expiry_time)

        users = User.objects.filter(
            **{'{}__iexact'.format(get_password_reset_lookup_field()): email})

        active_user_found = False

        for user in users:
            if user.eligible_for_reset():
                active_user_found = True

        if not active_user_found and not getattr(
                settings,
                'DJANGO_REST_PASSWORDRESET_NO_INFORMATION_LEAKAGE',
                False
        ):
            raise exceptions.ValidationError({
                'email': [_(
                    'Аккаунт, связанный с этой почтой не найден '
                    'Попробуйте другой адрес.'
                )],
            })

        for user in users:
            if user.eligible_for_reset():
                token = None
                if user.password_reset_tokens.all().count() > 0:
                    token = user.password_reset_tokens.all()[0]
                else:
                    token = ResetPasswordToken.objects.create(
                        user=user,
                        user_agent=request.META.get(
                            HTTP_USER_AGENT_HEADER, ''
                        ),
                        ip_address=request.META.get(
                            HTTP_IP_ADDRESS_HEADER, ''
                        ),
                    )
                reset_password_token_created.send(
                    sender=self.__class__,
                    instance=self,
                    reset_password_token=token
                )
                print(token)
        return Response({'status': 'OK'})


reset_password_validate_token = ResetPasswordValidateToken.as_view()
reset_password_confirm = ResetPasswordConfirm.as_view()
reset_password_request_token = ResetPasswordRequestToken.as_view()


@receiver(reset_password_token_created)
def password_reset_token_created(
        sender, instance, reset_password_token, *args, **kwargs):
    address = instance.request.build_absolute_uri(
        reverse('password_reset:reset-password-confirm'))
    token = reset_password_token.key
    mail_subject = 'Сброс пароля.'
    message = get_reset_password_email_message(
        website=instance.request.META['HTTP_HOST'],
        page=f'{address}?token={token}',
        user=reset_password_token.user.username
    )
    to_email = str(reset_password_token.user.email)
    email = EmailMessage(mail_subject, message, to=[to_email])
    email.send()
    return Response({'email': f'сообщение отправлено на {to_email}'},
                    status=status.HTTP_200_OK)
