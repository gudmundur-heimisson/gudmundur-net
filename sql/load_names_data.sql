LOAD DATA LOCAL INFILE 'pokemon_gen6_names.csv'
    INTO TABLE gudmvlpz_pokemon_gen6.names
    CHARACTER SET utf8
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    (pokedex_number, name)
