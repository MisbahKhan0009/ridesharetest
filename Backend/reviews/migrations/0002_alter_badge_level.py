# Generated by Django 5.1.7 on 2025-03-10 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='badge',
            name='level',
            field=models.CharField(choices=[('New', 'New'), ('Participant', 'Participant'), ('Good', 'Good'), ('Reliable', 'Reliable'), ('Hero', 'Hero')], default='New', max_length=20),
        ),
    ]
