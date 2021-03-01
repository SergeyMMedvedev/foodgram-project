from django.shortcuts import render
import os
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, F, Value, CharField
from wsgiref.util import FileWrapper
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import HttpResponse
from rest_framework import status, mixins, viewsets
from rest_framework.generics import CreateAPIView, RetrieveAPIView, UpdateAPIView, ListCreateAPIView, DestroyAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, generics
from rest_framework.decorators import api_view, permission_classes, action
from .models import (
    Ingredient,
    Recipe,
    Tag,
    Follow,
    # Favorite,
    Purchase
)
from .serializers import (
    IngredientSerializer,
    RecipeSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    FollowSerializer,
    # FavoriteSerializer,
    PurchaseSerializer,
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
from rest_framework.pagination import PageNumberPagination

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
    pagination_class = None

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


class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    # pagination_class = PageNumberPagination
    # pagination_class = None
    filter_backends = [DjangoFilterBackend, ]
    filter_fields = ['author__username', ]

    # permission_classes = [IsAuthenticated, ]

    def get_queryset(self):
        if self.request.query_params.getlist('tag__name'):
            tags = self.request.query_params.getlist('tag__name')
            queryset = Recipe.objects.filter(tag__name__in=tags).distinct()
        else:
            queryset = Recipe.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        request_ingredients = self.request.data.get('ingredient')
        request_ingredients = json.loads(request_ingredients)

        request_tags = self.request.data.get('tag')
        request_tags = json.loads(request_tags)

        ingredients = []
        for request_ingredient in request_ingredients:
            ingredients.append(Ingredient.objects.get_or_create(
                name=request_ingredient.get('name'),
                amount=request_ingredient.get('amount'),
                units=request_ingredient.get('units'))[0])
        author = get_object_or_404(User, username=self.request.user)
        tags = Tag.objects.filter(name__in=request_tags)
        serializer = self.get_serializer(instance,
                                         data=request.data,
                                         partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        serializer.save(ingredient=ingredients,
                        tag=tags,
                        author=author)
        return Response(serializer.data)


class FollowListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowSerializer
    model = Follow

    def get_queryset(self):
        if self.request.query_params.get('author'):
            queryset = Follow.objects.filter(
                author__username=self.request.query_params.get('author'),
                user=self.request.user)

        else:
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


# class FavoriteAPIView(mixins.CreateModelMixin,
#                       mixins.ListModelMixin,
#                       mixins.DestroyModelMixin,
#                       viewsets.GenericViewSet):
#     queryset = Favorite.objects.all()
#     serializer_class = FavoriteSerializer
#     permission_classes = [IsAuthenticated, ]
#     # pagination_class = None
#
#     def get_queryset(self):
#         queryset = Favorite.objects.filter(user=self.request.user)
#         return queryset
#
#     def perform_create(self, serializer):
#         print('perform_create')
#         print('perform_create self.request.data', self.request.data)
#         recipe = get_object_or_404(Recipe,
#                                    pk=self.request.data.get('favorite'))
#
#         serializer.save(user=self.request.user,
#                         favorite=recipe)

class FavoriteAPIView(
                      mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated, ]
    filter_backends = [DjangoFilterBackend, ]
    filter_fields = ['author__username', ]

    def get_queryset(self):
        tag_list = self.request.GET.getlist("tag__name")
        if tag_list:
            queryset = Recipe.objects.filter(
                subscribers=self.request.user,
                tag__name__in=tag_list).distinct()
        else:
            queryset = Recipe.objects.filter(subscribers=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):

        recipe = get_object_or_404(Recipe,
                                   pk=self.request.data.get('favorite'))
        recipe.subscribers.add(self.request.user)
        serializer = self.get_serializer(recipe)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        recipe = get_object_or_404(Recipe,
                                   pk=self.kwargs['pk'])
        recipe.subscribers.remove(self.request.user)
        serializer = self.get_serializer(recipe)
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)


class PurchaseAPIView(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [IsAuthenticated, ]
    pagination_class = None

    def get_queryset(self):
        queryset = Purchase.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):

        recipe = get_object_or_404(Recipe,
                                   pk=self.request.data.get('purchase'))

        serializer.save(user=self.request.user,
                        purchase=recipe)


# @csrf_exempt
# @action(detail=True, methods=['post'])
# def download_purchases(request, *args, **kwargs):
#     # short_report = open("somePdfFile", 'rb')
#     # response = HttpResponse(FileWrapper(short_report), content_type="text/xml; charset=utf-8")
#     print(request.input)
#     message = '!sdf'
#     with open("./temp_files/file.txt", 'w+') as f:
#         f.write(message)
#     with open("./temp_files/file.txt", 'r') as f:
#         file_text = f.read().strip()
#         print(file_text)
#     file_text = open("./temp_files/file.txt", 'rb')
#     print(file_text)
#
#     response = HttpResponse(FileWrapper(file_text),
#                             content_type='application/text charset=utf-8')
#     response['Content-Disposition'] = 'attachment; filename="file_text.txt"'
#     if os.path.isfile('/temp_files/file.txt'):
#         os.remove('/temp_files/file.txt')
#     return response


@api_view(http_method_names=['POST'])
@permission_classes((IsAuthenticated, ))
def download_purchases(request, *args, **kwargs):
    ingredients = {}
    for item in request.data:
        for ingredient in item['purchase']['ingredient']:
            if (f"{ingredient['name']} ({ingredient['units']})" in ingredients.keys()):
                ingredients[f"{ingredient['name']} ({ingredient['units']})"] += ingredient['amount']
            else:
                ingredients[f"{ingredient['name']} ({ingredient['units']})"] = ingredient['amount']

    with open("./temp_files/file.txt", 'w+') as f:
        for key in ingredients.keys():
            f.write(f"{key} — {ingredients[key]}\n")

    file_text = open("./temp_files/file.txt", 'rb')
    response = HttpResponse(FileWrapper(file_text),
                            content_type='application/text charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="file_text.txt"'
    if os.path.isfile('./temp_files/file.txt'):
        os.remove('./temp_files/file.txt')
    return response
