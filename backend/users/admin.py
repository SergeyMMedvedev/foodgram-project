from django.contrib import admin
from django.contrib.auth import get_user_model


User = get_user_model()


class WebUser(User):

    class Meta:
        proxy = True
        verbose_name = "User"
        verbose_name_plural = "Users"


class UserAdmin(admin.ModelAdmin):
    search_fields = ('user__username', 'user__email')


admin.site.register(WebUser, UserAdmin)
