import os
import csv
import codecs
import peewee as pw

username = os.environ['POKE_DB_USER']
password = os.environ['POKE_DB_PWD']

db = pw.PostgresqlDatabase('pokemon',
                           user=username, 
                           host='localhost',
                           password=password)

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

def get_base_stats():
    query = BaseStats.select(BaseStats, Pokemon, Form)\
            .join(Pokemon).switch(BaseStats)\
            .join(Form, join_type=pw.JOIN.LEFT_OUTER)\
            .order_by(BaseStats.id)
    return [{"id": q.id,
            "dex": q.pokemon.dex,
            "name": q.pokemon.name,
            "form": q.form.name if q.form is not None else None, 
            "health_points": q.health_points, 
            "attack": q.attack, 
            "defense": q.defense, 
            "special_attack": q.special_attack, 
            "special_defense": q.special_defense, 
            "speed": q.speed}
            for q in query]

if __name__ == '__main__':
    from pprint import pprint
    db.connect()
    pprint(get_base_stats())
    db.close()
