from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
User = get_user_model()


class Ingredient(models.Model):
    name = models.CharField(max_length=40, verbose_name='Название ингредиента')
    units = models.CharField(max_length=40, verbose_name='единицы измерения')
    amount = models.PositiveIntegerField(verbose_name='количество', default=0)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=40, verbose_name='тег')

    def __str__(self):
        return self.name


class Recipe(models.Model):
    TAGS = (
        ('завтрак', 'завтрак'),
        ('обед', 'обед'),
        ('ужин', 'ужин'),
    )
    author = models.ForeignKey(User,
                               on_delete=models.SET_NULL,
                               related_name="recipes",
                               null=True)
    name = models.CharField(max_length=40, verbose_name='Название рецепта')
    image = models.ImageField(upload_to='static/images/',
                              null=True,
                              blank=True)
    description = models.TextField(max_length=1000, default='')
    ingredient = models.ManyToManyField(Ingredient,
                                        default=None,
                                        related_name='ingredient',
                                        blank=False)

    tag = models.ManyToManyField(Tag,
                                 related_name='tag',
                                 blank=False,
                                 default='завтрак')

    cooking_time = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(1440)])

    def __str__(self):
        return f"рецепт от {self.author}, с названием {self.name}"


class Follow(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name="follower",
                             )
    author = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               related_name="following",
                               )

    class Meta:
        unique_together = ('user', 'author')

    def __str__(self):
        return f"пользователь {self.user} подписан на {self.author}"


class Favorite(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name="user",
                             )
    favorite = models.ForeignKey(Recipe,
                                 on_delete=models.CASCADE,
                                 related_name="favorite",
                                 )

    class Meta:
        unique_together = ('user', 'favorite')

    def __str__(self):
        return f"пользователь {self.user} подписан на {self.favorite}"


class Purchase(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name="customer",
                             )
    purchase = models.ForeignKey(Recipe,
                                 on_delete=models.CASCADE,
                                 related_name="purchase",
                                 )

    def __str__(self):
        return f"пользователь {self.user} покупает {self.purchase}"
