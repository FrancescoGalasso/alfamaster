from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Product(models.Model):
    # name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    # text = models.TextField()
#     id=models.IntegerField(primary_key=True)
    name = models.CharField(max_length=25, blank=False)
    owner = models.CharField(max_length=25, default='')
    # data = JSONField(default=list)
    created_date = models.DateTimeField(
            default=timezone.now)
    # published_date = models.DateTimeField(
    #         blank=True, null=True)
    # revision = models.IntegerField(default=1)
    currencies = models.CharField(max_length=25, default='')


    # def publish(self):
    #     self.published_date = timezone.now()
    #     self.save()

    def __str__(self):
        return self.name

class History(models.Model):
    data = JSONField(default=list)
    revision = models.IntegerField(default=0)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
