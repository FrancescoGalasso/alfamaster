from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Product(models.Model):
    name = models.CharField(max_length=25, blank=False)
    owner = models.CharField(max_length=25, default='')
    created_date = models.DateTimeField(
            default=timezone.now)
    currencies = models.CharField(max_length=25, default='')

    def __str__(self):
        return self.name

class History(models.Model):
    data = JSONField(default=list)
    revision = models.IntegerField(default=0)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
