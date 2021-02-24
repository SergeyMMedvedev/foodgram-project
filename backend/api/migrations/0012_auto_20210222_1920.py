# Generated by Django 3.0.5 on 2021-02-22 16:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_auto_20210222_1910'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='ingredient',
            field=models.ManyToManyField(default=None, related_name='ingredient', to='api.Ingredient'),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='tag',
            field=models.ManyToManyField(default='завтрак', related_name='tag', to='api.Tag'),
        ),
    ]
