LOAD DATA LOCAL INFILE 'pokemon_gen6_iv_clean.csv'
    INTO TABLE gudmvlpz_pokemon_gen6.individual_values
    CHARACTER SET utf8
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    IGNORE 1 LINES
    (pokedex_number, name, health_points, attack, defense, special_attack, special_defense, speed);

UPDATE individual_values SET total = health_points + attack + defense + special_attack + special_defense + speed;
