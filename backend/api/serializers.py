from rest_framework import serializers
from .models import Ingredient, Recipe, Tag
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

User = get_user_model()


class ChangePasswordSerializer(serializers.ModelSerializer):
    model = User
    old_password = serializers.CharField(required=True, min_length=8)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_again = serializers.CharField(required=True, min_length=8)

    class Meta:
        model = User
        fields = ('old_password', 'new_password', 'new_password_again')


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(required=True, min_length=2)
    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all()), ],
        required=True
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all()), ],
        required=True
    )

    class Meta:
        model = User
        fields = ('id', 'first_name', 'username', 'email', 'password')

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    units = serializers.CharField()
    amount = serializers.IntegerField()

    class Meta:
        fields = ('id', 'name', 'amount', 'units')
        model = Ingredient


class TagSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        fields = ('name',)
        model = Tag


class RecipeSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username'
    )
    name = serializers.CharField()
    image = serializers.ImageField(max_length=None,
                                   required=False,
                                   allow_empty_file=True,
                                   use_url=True)
    ingredient = IngredientSerializer(many=True, read_only=True)
    tag = TagSerializer(many=True, read_only=True)
    cooking_time = serializers.IntegerField(max_value=1440)

    class Meta:
        fields = '__all__'
        model = Recipe
