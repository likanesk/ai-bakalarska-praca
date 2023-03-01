-- uuid extension to use UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- role (user)
CREATE ROLE ecberdbuser NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'ecberdbpassword';
-- schema + grants
CREATE SCHEMA IF NOT EXISTS ecb_exchange_rates AUTHORIZATION postgres;
GRANT USAGE, CREATE ON SCHEMA ecb_exchange_rates TO ecberdbuser;
