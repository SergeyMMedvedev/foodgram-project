from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    IngredientViewSet,
    RecipeViewSet,
    FollowListCreateAPIView,
    FollowDestroyAPIView,
    FavoriteAPIView,
    PurchaseAPIView,
    download_purchases
)


router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'favorites', FavoriteAPIView, basename='favorites')
router.register(r'purchases', PurchaseAPIView, basename='purchases')


urlpatterns = [
    path('v1/', include(router.urls)),
    path('v1/users/', include('users.urls')),
    path('v1/subscriptions/', FollowListCreateAPIView.as_view()),
    path('v1/subscriptions/<int:pk>/', FollowDestroyAPIView.as_view()),
    path('v1/download/', download_purchases)
]
