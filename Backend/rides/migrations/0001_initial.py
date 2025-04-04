# Generated by Django 5.1.6 on 2025-03-02 15:08

import django.db.models.deletion
import rides.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Ride',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vehicle_type', models.CharField(choices=[('Private Car', 'Private Car'), ('Private Bike', 'Private Bike'), ('CNG', 'CNG'), ('Uber', 'Uber'), ('Taxi', 'Taxi'), ('Rickshaw', 'Rickshaw')], max_length=20)),
                ('pickup_name', models.CharField(max_length=100)),
                ('pickup_longitude', models.FloatField()),
                ('pickup_latitude', models.FloatField()),
                ('destination_name', models.CharField(max_length=100)),
                ('destination_longitude', models.FloatField()),
                ('destination_latitude', models.FloatField()),
                ('departure_time', models.DateTimeField()),
                ('total_fare', models.DecimalField(decimal_places=2, max_digits=10)),
                ('seats_available', models.PositiveIntegerField()),
                ('is_female_only', models.BooleanField(default=False)),
                ('vehicle_number_plate', models.CharField(blank=True, max_length=20, null=True)),
                ('ride_code', models.CharField(default=rides.models.generate_ride_code, max_length=6, unique=True)),
                ('is_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='hosted_rides', to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(blank=True, related_name='ride_members', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-departure_time'],
            },
        ),
        migrations.CreateModel(
            name='RideRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
                ('is_approved', models.BooleanField(default=False)),
                ('ride', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requests', to='rides.ride')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('ride', 'user')},
            },
        ),
    ]
