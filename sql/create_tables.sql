CREATE TABLE gen6.pokemon (
    dex INT NOT NULL,
    name VARCHAR NOT NULL,
    PRIMARY KEY(dex)
);

CREATE TABLE gen6.form (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    name VARCHAR NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES gen6.pokemon (dex)
);

CREATE TABLE gen6.basestats (
    id SERIAL,
    pokemon_id INT NOT NULL,
    form_id INT,
    health_points INT NOT NULL,
    attack INT NOT NULL,
    defense INT NOT NULL,
    special_attack INT NOT NULL,
    special_defense INT NOT NULL,
    speed INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (pokemon_id) REFERENCES gen6.pokemon (dex),
    FOREIGN KEY (form_id) REFERENCES gen6.form (id)
);

CREATE FUNCTION total(gen6.basestats)
  RETURNS INT AS
  $body$
  SELECT health_points + attack + defense + 
         special_attack + special_defense + speed
  FROM gen6.basestats WHERE $1.id = gen6.basestats.id
  $body$ LANGUAGE SQL STABLE;