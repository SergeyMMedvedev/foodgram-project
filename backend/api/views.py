import os
import json
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404, HttpResponse

from rest_framework import status, mixins, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import (
    ListCreateAPIView,
    DestroyAPIView,
)
from rest_framework.permissions import (
    IsAuthenticated
)
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from wsgiref.util import FileWrapper

from .models import (
    Ingredient,
    Recipe,
    Tag,
    Follow,
    Purchase
)
from .serializers import (
    IngredientSerializer,
    RecipeSerializer,
    FollowSerializer,
    PurchaseSerializer,
)


User = get_user_model()


class IngredientViewSet(ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    pagination_class = None

    def get_queryset(self):
        if self.request.query_params:
            queryset = Ingredient.objects.filter(
                name__startswith=self.request.query_params.get('search'),
                amount=0)
        else:
            queryset = Ingredient.objects.all()
        return queryset


class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    filter_backends = [DjangoFilterBackend, ]
    filter_fields = ['author__username', ]

    def get_queryset(self):
        tag_list = self.request.GET.getlist("tag__name")
        if tag_list:
            queryset = Recipe.objects.filter(
                tag__name__in=tag_list).distinct()
        else:
            queryset = Recipe.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):
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
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(ingredient=ingredients,
                            tag=tags,
                            author=author)
            return Response(serializer.data)
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
        author = get_object_or_404(User,
                                   username=self.request.data.get('author'))
        serializer.save(user=self.request.user,
                        author=author)


class FollowDestroyAPIView(DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowSerializer
    model = Follow
    queryset = Follow.objects.all()


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


@api_view(http_method_names=['POST'])
@permission_classes((IsAuthenticated, ))
def download_purchases(request, *args, **kwargs):
    ingredients = {}
    for item in request.data:
        for ingredient in item['purchase']['ingredient']:
            if (f"{ingredient['name']} ({ingredient['units']})"
                    in ingredients.keys()):
                ingredients[f"{ingredient['name']} ({ingredient['units']})"] \
                    += ingredient['amount']
            else:
                ingredients[f"{ingredient['name']} ({ingredient['units']})"] \
                    = ingredient['amount']

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
