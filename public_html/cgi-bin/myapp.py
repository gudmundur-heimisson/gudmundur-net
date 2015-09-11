#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

from peewee import *

from flask import Flask, render_template
from flask_peewee.db import Database
from flask_peewee.rest import RestAPI, RestResource

DATABASE = {
    'name': 'gudmvlpz_pokemon_gen6',
    'engine': 'peewee.MySQLDatabase',
    'user': 'gudmvlpz_pokedb',
    'passwd': 'v4545kr1m5l1'
}

app = Flask(__name__)
app.config.from_object(__name__)

db = Database(app)

class BaseStats(db.Model):
    attack = IntegerField()
    defense = IntegerField()
    name = CharField(max_length=128)
    health_points = IntegerField()
    pokedex_number = PrimaryKeyField()
    special_attack = IntegerField()
    special_defense = IntegerField()
    speed = IntegerField()
    total = IntegerField()

    class Meta:
        db_table = 'individual_values'

class Names(db.Model):
    name = CharField(max_length=128)
    pokedex_number = PrimaryKeyField()

    class Meta:
        db_table = 'names'

class PokeResource(RestResource):
    pass

class IvResource(PokeResource):
    paginate_by = 1000

class NameResource(PokeResource):
    paginate_by = 1000


api = RestAPI(app)
api.register(Names, PokeResource)
api.register(BaseStats, PokeResource)
api.setup()

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/contact")
def contact():
    return render_template('contact.html')

@app.route("/resume")
def resume():
    return render_template('resume.html')

@app.route("/kde")
def kde():
    return render_template('kde.html')

@app.route("/base-stats-browser")
def iv_browser():
      return render_template('base-stats-browser.html')

@app.route("/test")
def test():
    return sys.executable

if __name__ == "__main__":
    app.debug = True
    app.run()
