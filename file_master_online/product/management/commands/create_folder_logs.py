# -*- coding: UTF-8 -*-
from __future__ import absolute_import
import signal
import sys
import os
from django.core.management.base import BaseCommand
# from django.core.management.base import CommandError


class Command(BaseCommand):
    help = u'Create folder for web app logs'

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)
        # self.stdout.write("__init__")

    def handle(self, *args, **options):
        # self.stdout.write("handle")
        path = os.path.abspath(os.path.join(os.path.dirname(__file__),"../../.."))
        directory = "logs"
        if not os.path.exists(path+ os.sep+directory):
            os.makedirs(directory)
            print("Folder 'logs' is created!")
        else:
            print("Folder 'logs' was already created!")
