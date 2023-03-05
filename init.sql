-- uuid extension to use UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- role (user)
CREATE ROLE ecberdbuser NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'ecberdbpassword';
-- schema + grants
CREATE SCHEMA IF NOT EXISTS ecb_exchange_rates AUTHORIZATION postgres;
GRANT USAGE, CREATE ON SCHEMA ecb_exchange_rates TO ecberdbuser;

-- create db structure

-- 
DROP TABLE IF EXISTS ecb_exchange_rates."user";
CREATE TABLE ecb_exchange_rates."user" (
	record_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	user_name varchar(64) NOT NULL,
	user_pass varchar(64) NOT NULL,
	is_admin bool NOT NULL DEFAULT false,
	CONSTRAINT "PK_d0c1972a0031748dfb3c0cba1e1" PRIMARY KEY (record_id)
);
CREATE INDEX "IDX_126841b968a45e2d3997ebfa33" ON ecb_exchange_rates."user" USING btree (is_admin);
CREATE INDEX "IDX_316766472d5452e572d5b4c8eb" ON ecb_exchange_rates."user" USING btree (user_pass);
CREATE UNIQUE INDEX "IDX_d34106f8ec1ebaf66f4f8609dd" ON ecb_exchange_rates."user" USING btree (user_name);
GRANT DELETE, INSERT, UPDATE, TRUNCATE, SELECT, TRIGGER, REFERENCES ON TABLE ecb_exchange_rates."user" TO ecberdbuser;

--
-- fill start-up data to the db
INSERT INTO ecb_exchange_rates."user" (record_id,user_name,user_pass,is_admin) VALUES
	 ('d123fea3-b610-47cf-a2d0-f628f8ef81f7','adrian.ihring@gmail.com','a+J}pF$+2}u+Y3hn','y');


