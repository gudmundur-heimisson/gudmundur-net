#!/usr/local/bin/python3
import csv
import peewee as pw

db = pw.MySQLDatabase('gudmvlpz_pokemon',
                      user='gudmvlpz_pokedb', 
                      password='v4545kr1m5l1',
                      charset='utf8')

class PokeModel(pw.Model):
    class Meta:
        database = db

class Pokemon(PokeModel):
    dex = pw.IntegerField(primary_key=True)
    name = pw.CharField()

class Form(PokeModel):
    id = pw.PrimaryKeyField()
    pokemon = pw.ForeignKeyField(Pokemon)
    name = pw.CharField()

class BaseStats(PokeModel):
    id = pw.PrimaryKeyField()
    pokemon = pw.ForeignKeyField(Pokemon)
    form = pw.ForeignKeyField(Form, null=True)
    health_points = pw.IntegerField()
    attack = pw.IntegerField()
    defense = pw.IntegerField()
    special_attack = pw.IntegerField()
    special_defense = pw.IntegerField()
    speed = pw.IntegerField()

def create_tables():
    db.connect()
    db.create_tables([Pokemon, Form, BaseStats])

def drop_tables():
    db.connect()
    db.drop_tables([Pokemon, Form, BaseStats])

def reload_tables():
    db.connect()
    db.drop_tables([Pokemon, Form, BaseStats])
    db.create_tables([Pokemon, Form, BaseStats])

def load_data():
    db.connect()
    with open('./data/forms.csv', 'rb') as infile:
        reader = csv.reader(infile, delimiter=',')
        header = next(reader)
        lastName = None
        for row in reader:
            dex, name, form, *stats = row
            if 'Nidoran' in name:
                print(name)
            form = None if form == '' else form
            hp, atk, df, spatk, spdef, spd = stats
            if lastName != name:
                pokemon = Pokemon.create(dex=dex, name=name)
                lastName = name
            if form is not None:
                form = Form.create(pokemon=pokemon, name=form)
            BaseStats.create(pokemon=pokemon, form=form,
                             health_points = hp,
                             attack = atk,
                             defense = df,
                             special_attack = spatk,
                             special_defense = spdef,
                             speed = spd)
