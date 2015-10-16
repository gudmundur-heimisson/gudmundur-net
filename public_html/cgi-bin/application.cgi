#!/usr/local/bin/python3
# -*- coding: utf-8 -*-

import sys

from wsgiref.handlers import CGIHandler
from app import app

def app_with_fixed_path_info(environment, start_response):
    if environment.get("PATH_INFO") is None:
        environment["PATH_INFO"] = ""
    return app(environment, start_response)

CGIHandler().run(app_with_fixed_path_info)
