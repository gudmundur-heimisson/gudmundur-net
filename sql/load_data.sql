COPY gen6.pokemon
  FROM '/var/lib/pgsql/external/pokemon.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER true);

COPY gen6.form
  FROM '/var/lib/pgsql/external/form.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER true);

COPY gen6.basestats
  FROM '/var/lib/pgsql/external/basestats.csv'
  WITH (FORMAT csv,
        ENCODING 'utf8',
        DELIMITER E'\t',
        HEADER true,
        NULL 'NULL');
