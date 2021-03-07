from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator

User = get_user_model()


class Ingredient(models.Model):
    name = models.CharField(max_length=40, verbose_name='Название ингредиента')
    units = models.CharField(max_length=40, verbose_name='единицы измерения')
    amount = models.PositiveIntegerField(verbose_name='количество', default=0)

    class Meta:
        verbose_name = 'ингредиент'
        verbose_name_plural = 'ингредиенты'

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=40, verbose_name='тег')

    class Meta:
        verbose_name = 'тег'
        verbose_name_plural = 'теги'

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

    subscribers = models.ManyToManyField(User,
                                         default=None,
                                         related_name='subscribers',
                                         blank=True)

    pub_date = models.DateTimeField('Дата публикации',
                                    auto_now_add=True)

    class Meta:
        verbose_name = 'рецепт'
        verbose_name_plural = 'рецепты'
        ordering = ['-pub_date']

    def __str__(self):
        return f"рецепт от {self.author}, под названием {self.name}"


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
        verbose_name = 'подписка'
        verbose_name_plural = 'подписки'
        ordering = ['-id']
        unique_together = ('user', 'author')

    def __str__(self):
        return f"пользователь {self.user} подписан на {self.author}"


class Purchase(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name="customer",
                             )
    purchase = models.ForeignKey(Recipe,
                                 on_delete=models.CASCADE,
                                 related_name="purchase",
                                 )

    class Meta:
        verbose_name = 'покупка'
        verbose_name_plural = 'покупки'

    def __str__(self):
        return f"пользователь {self.user} покупает {self.purchase}"
