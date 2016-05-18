#!usr/bin/env python
# -*- coding: utf-8 -*-

import csv
import re

def writeNames():
    with open('pokemon_gen6_iv.csv', 'r') as ivfile, \
         open('pokemon_gen6_names', 'w') as namefile:
        pokereader = csv.reader(ivfile, delimiter=",")
        pokewriter = csv.writer(namefile, delimiter=",")
        for row in pokereader:
            pokeno = row[0]
            if len(pokeno) == 3:
                name = row[1]
                name = name.split(' ')[0]
                pokewriter.writerow([pokeno, name])

def cleanIVs():
    with open('pokemon_gen6_iv.csv', 'r') as ivfile, \
         open('pokemon_gen6_iv_clean.csv', 'w') as ivcleanfile:
         pokereader = csv.reader(ivfile, delimiter=",")
         pokewriter = csv.writer(ivcleanfile, delimiter=",")
         pokewriter.writerow(['number', 'name', 'forme', 'hp', 'atk', 'def', 'sp atk', 'sp def', 'spd'])
         for i,row in enumerate(pokereader):
            pokeno, name, hp, atk, defs, spatk, spdef, spd, total, avg = row
            split = name.split(' (')
            if len(split) > 1:
                name, forme = split
                forme = forme.strip(')')
                if not (name in forme):
                    forme = name + " " + forme
            else:
                forme = name
            pokeno = pokeno[:3]
            pokewriter.writerow([pokeno, forme, hp, atk, defs, spatk, spdef, spd])


if __name__ == "__main__":
    cleanIVs()