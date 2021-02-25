from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    IngredientViewSet,
    RecipeViewSet,
    RecipeAPIView,
    UserCreateAPIView,
    UserView,
    ChangePasswordView,
    FollowListCreateAPIView,
    FollowDestroyAPIView,
    FavoriteAPIView,
)
from rest_framework.authtoken import views

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'favorites', FavoriteAPIView, basename='favorites')


urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/recipes2/', RecipeAPIView.as_view()),
    path('v1/signin/', views.obtain_auth_token),
    path('v1/signup/', UserCreateAPIView.as_view()),
    path('v1/users/me/', UserView.as_view()),
    path('v1/change-password/', ChangePasswordView.as_view()),
    path('v1/subscriptions/', FollowListCreateAPIView.as_view()),
    path('v1/subscriptions/<int:pk>/', FollowDestroyAPIView.as_view())
]
