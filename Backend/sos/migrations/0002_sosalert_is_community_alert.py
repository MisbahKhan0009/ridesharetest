# Generated by Django 5.1.5 on 2025-03-08 20:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sosalert',
            name='is_community_alert',
            field=models.BooleanField(default=False),
        ),
    ]
