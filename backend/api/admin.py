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


class IngredientsInline(admin.TabularInline):
    model = Ingredient


class RecipeAdmin(admin.ModelAdmin):
    list_display = ('pk',
                    'author',
                    'name',
                    'image',
                    'description',
                    'ingredient_names',
                    'subscribers_count',
                    )

    def subscribers_count(self, obj):
        return obj.subscribers.all().count()

    def ingredient_names(self, obj):
        return list(obj.ingredient.all())

    search_fields = ("name", "author__username",)
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
