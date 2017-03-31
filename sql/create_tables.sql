--liquibase formatted sql

--changeset gummi:pokemon
CREATE TABLE gen7.pokemon (
    dex INT NOT NULL,
    name VARCHAR NOT NULL,
    PRIMARY KEY(dex)
);
--rollback DROP TABLE gen7.pokemon;

--changeset gummi:form
CREATE TABLE gen7.form (
    id SERIAL PRIMARY KEY,
    pokemon_id INT NOT NULL,
    name VARCHAR NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES gen7.pokemon (dex)
);
--rollback DROP TABLE gen7.form;

--changeset gummi:basestats
CREATE TABLE gen7.basestats (
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
    FOREIGN KEY (pokemon_id) REFERENCES gen7.pokemon (dex),
    FOREIGN KEY (form_id) REFERENCES gen7.form (id)
);
--rollback DROP TABLE gen7.basestats;

--changeset gummi:total
CREATE FUNCTION total(gen7.basestats)
  RETURNS INT AS
  $body$
  SELECT health_points + attack + defense + 
         special_attack + special_defense + speed
  FROM gen7.basestats WHERE $1.id = gen7.basestats.id
  $body$ LANGUAGE SQL STABLE;
--rollback DROP FUNCTION total;