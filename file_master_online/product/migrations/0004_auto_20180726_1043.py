# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2018-07-26 08:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0003_auto_20180724_1825'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='id',
        ),
        migrations.AddField(
            model_name='product',
            name='owner',
            field=models.CharField(default='', max_length=25),
        ),
        migrations.AlterField(
            model_name='product',
            name='name',
            field=models.CharField(max_length=25, primary_key=True, serialize=False),
        ),
    ]
