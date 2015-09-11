#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, render_template
app = Flask(__name__)

@app.route("/")
def index():
    return "Hello world!"

@app.route("/contact")
def contact():
  try:
    return render_template("contact")
  except Exception as e:
    return str(e)

if __name__ == "__main__":
    app.debug = True
    app.run()