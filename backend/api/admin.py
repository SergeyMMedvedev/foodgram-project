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
    empty_value_display = "-пусто-"


class IngredientAdmin(admin.ModelAdmin):
    list_display = (
        'pk',
        'name',
        'amount',
        'units')
    search_fields = ("name",)
    empty_value_display = "-пусто-"


class RecipeAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'author',
                    'name',
                    'image',
                    'description',
                    'cooking_time',
                    )
    search_fields = ("name",)
    empty_value_display = "-пусто-"


class FollowAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'user',
                    'author',
                    )
    empty_value_display = "-пусто-"


class PurchaseAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'user',
                    'purchase',
                    )
    empty_value_display = "-пусто-"


admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Purchase, PurchaseAdmin)
