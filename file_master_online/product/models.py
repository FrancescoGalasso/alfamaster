from __future__ import unicode_literals

from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class Product(models.Model):
    # name = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    # text = models.TextField()
    name = models.CharField(primary_key=True, max_length=25, blank=False)
    owner = models.CharField(max_length=25, default='')
    data = JSONField(default=list)
    created_date = models.DateTimeField(
            default=timezone.now)
    published_date = models.DateTimeField(
            blank=True, null=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.name