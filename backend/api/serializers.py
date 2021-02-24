from rest_framework import serializers
from .models import Ingredient, Recipe, Tag
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.core import exceptions
import django.contrib.auth.password_validation as validators

User = get_user_model()


class ChangePasswordSerializer(serializers.ModelSerializer):
    model = User
    old_password = serializers.CharField(required=True, min_length=8)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_again = serializers.CharField(required=True, min_length=8)

    class Meta:
        model = User
        fields = ('old_password', 'new_password', 'new_password_again')

    def validate(self, data):
        # here data has all the fields which have validated values
        # so we can create a User instance out of it
        # get the password from the data
        password = data.get('new_password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validators.validate_password(password=password)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['new_password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(ChangePasswordSerializer, self).validate(data)


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

    def validate(self, data):
        # here data has all the fields which have validated values
        # so we can create a User instance out of it
        user = User(**data)

        # get the password from the data
        password = data.get('password')

        errors = dict()
        try:
            # validate the password and catch the exception
            validators.validate_password(password=password, user=User)

        # the exception raised here is different than serializers.ValidationError
        except exceptions.ValidationError as e:
            errors['password'] = list(e.messages)

        if errors:
            raise serializers.ValidationError(errors)

        return super(UserSerializer, self).validate(data)


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
