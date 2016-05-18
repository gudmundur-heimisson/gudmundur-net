CREATE TABLE individual_values (
    pokedex_number INT NOT NULL,
    name VARCHAR(128),
    health_points INT NOT NULL,
    attack INT NOT NULL,
    defense INT NOT NULL,
    special_attack INT NOT NULL,
    special_defense INT NOT NULL,
    speed INT NOT NULL,
    total INT NOT NULL,
    PRIMARY KEY (pokedex_number, name)
);