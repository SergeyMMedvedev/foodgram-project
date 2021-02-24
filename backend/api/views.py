from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import Ingredient, Recipe, Tag
from .serializers import (
    IngredientSerializer,
    RecipeSerializer,
    UserSerializer,
    ChangePasswordSerializer
)
from rest_framework.parsers import MultiPartParser, FileUploadParser, FormParser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
import json
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.permissions import (
    IsAuthenticated
)
from django.shortcuts import get_object_or_404, get_list_or_404


User = get_user_model()


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
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
            # Check old password
            old_password = serializer.data.get("old_password")
            if not self.object.check_password(old_password):
                return Response({"old_password": ["неверный пароль."]},
                                status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
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
                return Response({"new_password": ["новый пароль не подтвержден"]},
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
    # permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        token, created = Token.objects.get_or_create(
            user_id=response.data["id"])
        response.data["token"] = str(token)
        return response


class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer

    def get_queryset(self):
        if (self.request.query_params):
            queryset = Ingredient.objects.filter(
                name__startswith=self.request.query_params.get('search'),
                amount=0)
        else:
            queryset = Ingredient.objects.all()
        return queryset


class RecipeAPIView(APIView):
    parser_classes = (FormParser, MultiPartParser)
    # permission_classes = [IsAuthenticated, ]


    def post(self, request):
        print(request.data)
        request_ingredients = self.request.data.get('ingredient')
        request_ingredients = json.loads(request_ingredients)



        request_tags = self.request.data.get('tag')
        request_tags = json.loads(request_tags)
        print(request_tags)

        ingredients = []
        for request_ingredient in request_ingredients:
            ingredients.append(Ingredient.objects.get_or_create(
                name=request_ingredient.get('name'),
                amount=request_ingredient.get('amount'),
                units=request_ingredient.get('units'))[0])
            # print(request_ingredient)

        tags = Tag.objects.filter(name__in=request_tags)
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ingredient=ingredients, tag=tags)
            return Response(serializer.data)
        return Response(serializer.errors)
        # return Response('response')

    def get(self, request):
        print('get')
        print(request)
        print(request.data)
        return Response('dfgdfgsgf')


class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    # permission_classes = [IsAuthenticated, ]

    def perform_create(self, serializer):
        request_ingredients = self.request.data.get('ingredient')
        request_tags = self.request.data.get('tag')
        # print(request_ingredients)
        # names = []
        # amount = []
        # units = []
        ingredients = []
        for request_ingredient in request_ingredients:
            ingredients.append(Ingredient.objects.get_or_create(
                name=request_ingredient.get('name'),
                amount=request_ingredient.get('amount'),
                units=request_ingredient.get('units'))[0])
        # print(ingredients)
        # ingredients = Ingredient.objects.filter(
        #         name__in=names,
        #         units__in=units)
        tags = Tag.objects.filter(name__in=request_tags)
        serializer.save(ingredient=ingredients, tag=tags)


