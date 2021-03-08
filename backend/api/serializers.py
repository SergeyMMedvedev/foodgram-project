from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from .models import (
    Ingredient,
    Recipe,
    Tag,
    Follow,
    Purchase
)
from users.serializers import UserSerializer

User = get_user_model()


class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)
    units = serializers.CharField(required=True)
    amount = serializers.IntegerField(required=True)

    class Meta:
        fields = ('id', 'name', 'amount', 'units')
        model = Ingredient


class TagSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)

    class Meta:
        fields = ('name',)
        model = Tag


class RecipeSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    name = serializers.CharField(
        min_length=2,
        max_length=50,
        required=True,
    )
    image = serializers.ImageField(
        max_length=None,
        required=True,
        allow_empty_file=False,
        use_url=True,
    )
    image_url = serializers.SerializerMethodField('get_image_url')
    ingredient = IngredientSerializer(
        many=True,
        read_only=True,
    )
    tag = TagSerializer(
        many=True,
        read_only=True
    )
    cooking_time = serializers.IntegerField(
        max_value=1440,
        required=True
    )
    subscribers = UserSerializer(many=True, read_only=True,)

    class Meta:
        fields = '__all__'
        model = Recipe

    def get_image_url(self, recipe):
        request = self.context.get('request')
        if request:
            image_url = recipe.image.url
            return f"http://127.0.0.1{image_url}"


class FollowSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )

    def validate(self, attrs):
        if self.context.get('request').method == 'POST':
            author_username = self.context.get('request').data.get('author')
            author = get_object_or_404(User, username=author_username)
            user = self.context.get('request').user
            if user == author:
                raise serializers.ValidationError(
                    'Нельзя подписаться на самого себя')
            if Follow.objects.filter(user=user, author=author):
                raise serializers.ValidationError(
                    'Вы уже подписаны на этого автора')
        return attrs

    class Meta:
        fields = '__all__'
        model = Follow


class PurchaseSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    purchase = RecipeSerializer(read_only=True)

    class Meta:
        fields = '__all__'
        model = Purchase
