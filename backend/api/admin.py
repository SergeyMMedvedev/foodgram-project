from django.contrib import admin
from .models import (
    Ingredient,
    Recipe,
    Tag,
    Follow,
    Purchase
)


class TagAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name')


class IngredientAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'amount', 'units')


class RecipeAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'author',
                    'name',
                    'image',
                    'description',
                    'cooking_time',
                    )


class FollowAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'user',
                    'author',
                    )


class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'user',
                    'purchase',
                    )


admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Purchase, PurchaseAdmin)
