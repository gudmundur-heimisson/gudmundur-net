import csv
import re

class Pokemon():
    def __init__(self, dexNumber, name, form, hp, atk, dfe, spatk, spdef, spd):
        self.dex   = dex
        self.name  = name
        self.form  = form
        self.hp    = hp
        self.atk   = atk
        self.dfe   = dfe
        self.spatk = spatk
        self.spdef = spdef
        self.spd   = spd

    def asRow(self, delimiter=","):
        return [self.dex, self.name,
            self.form, self.hp, self.atk, self.dfe, self.spatk,
            self.spdef, self.spd]

    def __str__(self):
        return self.name + (" (%s)" % self.form if self.form is not None else "")

pokemons = []
with open("forms.txt", 'r') as infile:
    reader = csv.reader(infile, delimiter="\t", strict=True)
    header = next(reader)
    for row in reader:
        # print(row)
        dex, name, *stats, total, average = row
        dex = int(dex[:3])
        names = re.compile(r"^(?P<name>[^(]+) (\((?P<form>.*)\))?")
        # print(name)
        match = names.match(name)
        name = match.group('name')
        form = match.group('form')
        if form is not None:
            namePat = re.compile("%s" % name)
            form = ' '.join(re.split(" *%s *" % name, form))
            form = form.strip()
            # print(form)
        stats = [int(s.strip()) for s in stats]
        pokemon = Pokemon(dex, name, form, *stats)
        pokemons.append(pokemon)

with open("forms.csv", 'w') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(["dex", "name", "form", "hp", "atk", "def", "spatk", "spdef", "spd"])
    for pokemon in pokemons:
        writer.writerow(pokemon.asRow())