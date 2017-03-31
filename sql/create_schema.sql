CREATE SCHEMA gen7 AUTHORIZATION poke_user;

ALTER ROLE poke_user
SET search_path TO '$user', 'gen7';
