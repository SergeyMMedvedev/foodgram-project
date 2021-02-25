from django.shortcuts import render
from rest_framework import status, mixins, viewsets
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, ListCreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, generics
from .models import Ingredient, Recipe, Tag, Follow, Favorite
from .serializers import (
    IngredientSerializer,
    RecipeSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    FollowSerializer,
    FavoriteSerializer
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
        print(request.data)
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
    permission_classes = [IsAuthenticated, ]


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
        print(self.request.user)
        author = get_object_or_404(User, username=self.request.user)
        print(author)
        tags = Tag.objects.filter(name__in=request_tags)
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ingredient=ingredients,
                            tag=tags,
                            author=author)
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
        print('self.request.user', self.request.user)
        tags = Tag.objects.filter(name__in=request_tags)
        serializer.save(
            ingredient=ingredients,
            tag=tags,
            author=self.request.user)

    def get_queryset(self):
        print('self.request.query_params.get(author)', self.request.query_params.get('author'))
        if self.request.query_params.get('author'):

            author_name = self.request.query_params.get('author')
            print('author_name', author_name)
            author = get_object_or_404(User, username=author_name)
            print('author', author)
            queryset = Recipe.objects.filter(author=author)
            print('queryset', queryset)
        else:
            queryset = Recipe.objects.all()
        return queryset


class FollowListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowSerializer
    model = Follow

    def get_queryset(self):
        queryset = Follow.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        print(self.request.data)
        author = get_object_or_404(User,
                                   username=self.request.data.get('author'))
        serializer.save(user=self.request.user,
                        author=author)


class FollowDestroyAPIView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowSerializer
    model = Follow
    queryset = Follow.objects.all()


class FavoriteAPIView(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        queryset = Favorite.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        print('perform_create')
        print('perform_create self.request.data', self.request.data)
        recipe = get_object_or_404(Recipe,
                                   pk=self.request.data.get('favorite'))

        serializer.save(user=self.request.user,
                        favorite=recipe)
