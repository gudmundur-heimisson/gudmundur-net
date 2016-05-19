CREATE ROLE poke_user 
WITH LOGIN ENCRYPTED PASSWORD 'md5189f75aa36752d75691a4cdf2567f9ae';

CREATE DATABASE pokemon
WITH OWNER = poke_user;

CREATE SCHEMA gen6 AUTHORIZATION poke_user;

ALTER ROLE poke_user
SET search_path TO '$user', 'gen6', 'public';
