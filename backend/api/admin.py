from django.contrib import admin
from .models import Ingredient, Recipe, Tag


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


admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Tag, TagAdmin)
