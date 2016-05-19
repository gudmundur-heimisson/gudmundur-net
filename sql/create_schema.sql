CREATE SCHEMA gen6 AUTHORIZATION poke_user;

ALTER ROLE poke_user
SET search_path TO '$user', 'gen6', 'public';