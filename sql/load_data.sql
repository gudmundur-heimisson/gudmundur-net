COPY gen7.pokemon
  FROM '/var/lib/pgsql/external/pokemon.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER false);

COPY gen7.form
  FROM '/var/lib/pgsql/external/form.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER false);

COPY gen7.basestats
  FROM '/var/lib/pgsql/external/basestats.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER true,
        NULL '');
