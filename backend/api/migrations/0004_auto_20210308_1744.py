# Generated by Django 3.0.5 on 2021-03-08 14:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_ingredient_amount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ingredient',
            name='name',
            field=models.CharField(max_length=80, verbose_name='Название ингредиента'),
        ),
        migrations.AlterField(
            model_name='ingredient',
            name='units',
            field=models.CharField(max_length=80, verbose_name='единицы измерения'),
        ),
    ]
