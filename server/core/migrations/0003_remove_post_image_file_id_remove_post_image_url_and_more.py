# Generated by Django 5.2.1 on 2025-05-21 18:19

import core.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_user_options_alter_user_managers_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image_file_id',
        ),
        migrations.RemoveField(
            model_name='post',
            name='image_url',
        ),
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(null=True, upload_to=core.models.post_image_path),
        ),
    ]
