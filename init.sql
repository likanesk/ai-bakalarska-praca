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

---
DROP TABLE IF EXISTS ecb_exchange_rates.user_activity;
CREATE TABLE ecb_exchange_rates.user_activity (
	record_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	created timestamp NOT NULL DEFAULT now(),
	user_record_id uuid NOT NULL,
	route varchar(255) NOT NULL,
	CONSTRAINT "PK_1e93e12ed16fbf1b18648229461" PRIMARY KEY (record_id)
);
CREATE INDEX "IDX_89b3767520b3916367e1098b4e" ON ecb_exchange_rates.user_activity USING btree (route);
CREATE INDEX "IDX_94e582e0906233a30cd8a2c635" ON ecb_exchange_rates.user_activity USING btree (created);
ALTER TABLE ecb_exchange_rates.user_activity ADD CONSTRAINT "FK_5bd7b71ddd4f10e20b0916d0343" FOREIGN KEY ("user_record_id") REFERENCES ecb_exchange_rates."user"(record_id);
GRANT DELETE, INSERT, UPDATE, TRUNCATE, SELECT, TRIGGER, REFERENCES ON TABLE ecb_exchange_rates."user_activity" TO ecberdbuser;

--
-- fill start-up data to the db
INSERT INTO ecb_exchange_rates."user" (record_id,user_name,user_pass,is_admin) VALUES
	 ('d123fea3-b610-47cf-a2d0-f628f8ef81f7','adrian.ihring@gmail.com','a+J}pF$+2}u+Y3hn','y');


