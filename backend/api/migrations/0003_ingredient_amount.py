# Generated by Django 3.0.5 on 2021-03-06 18:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_ingredient_amount'),
    ]

    operations = [
        migrations.AddField(
            model_name='ingredient',
            name='amount',
            field=models.PositiveIntegerField(default=0, verbose_name='количество'),
        ),
    ]
