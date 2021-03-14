from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator

User = get_user_model()


class Ingredient(models.Model):
    name = models.CharField(
        max_length=100, verbose_name='Название ингредиента'
    )
    units = models.CharField(max_length=100, verbose_name='Единицы измерения')
    amount = models.PositiveIntegerField(
        verbose_name='Количество',
        default=1,
        validators=[MinValueValidator(1), ]
    )

    class Meta:
        verbose_name = 'Ингредиент'
        verbose_name_plural = 'Ингредиенты'

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=40, verbose_name='Тег')

    class Meta:
        verbose_name = 'Тег'
        verbose_name_plural = 'Теги'

    def __str__(self):
        return self.name


class Recipe(models.Model):
    author = models.ForeignKey(User,
                               on_delete=models.SET_NULL,
                               related_name='recipes',
                               null=True,
                               verbose_name='Автор рецепта')
    name = models.CharField(max_length=200, verbose_name='Название рецепта')
    image = models.ImageField(upload_to='static/images/',
                              null=True,
                              blank=True,
                              verbose_name='Изображение')
    description = models.TextField(
        max_length=1000, default='', verbose_name='Описание')
    ingredient = models.ManyToManyField(Ingredient,
                                        default=None,
                                        related_name='ingredient',
                                        blank=False,
                                        verbose_name='Ингредиент',
                                        )

    tag = models.ManyToManyField(Tag,
                                 related_name='tag',
                                 blank=False,
                                 default='завтрак',
                                 verbose_name='Тег')

    cooking_time = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(1440)])

    subscribers = models.ManyToManyField(User,
                                         default=None,
                                         related_name='subscribers',
                                         blank=True,
                                         verbose_name='Сохранившие')

    pub_date = models.DateTimeField('Дата публикации',
                                    auto_now_add=True)

    class Meta:
        verbose_name = 'рецепт'
        verbose_name_plural = 'рецепты'
        ordering = ['-pub_date']

    def __str__(self):
        return f'рецепт от {self.author}, под названием {self.name}'


class Follow(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='follower',
                             verbose_name='Подписчик'
                             )
    author = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               related_name='following',
                               verbose_name='Автор'
                               )

    class Meta:
        verbose_name = 'подписка'
        verbose_name_plural = 'подписки'
        ordering = ['-id']
        unique_together = ('user', 'author')

    def __str__(self):
        return f'пользователь {self.user} подписан на {self.author}'


class Purchase(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE,
                             related_name='customer',
                             verbose_name='Пользователь'
                             )
    purchase = models.ForeignKey(Recipe,
                                 on_delete=models.CASCADE,
                                 related_name='purchase',
                                 verbose_name='Покупка'
                                 )

    class Meta:
        verbose_name = 'покупка'
        verbose_name_plural = 'покупки'

    def __str__(self):
        return f'пользователь {self.user} покупает {self.purchase}'
