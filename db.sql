drop table user_account cascade;
drop table class CASCADE;
drop table assignments CASCADE;
drop table notes CASCADE;

CREATE TABLE user_account
( id            SERIAL PRIMARY KEY NOT NULL
, username      VARCHAR(30)        NOT NULL UNIQUE
, password      VARCHAR(255)       NOT NULL
);

CREATE TABLE class
( id            SERIAL PRIMARY KEY      NOT NULL
, user_id       INT                     NOT NULL REFERENCES user_account(id)
, class_name    varchar(40) UNIQUE      NOT NULL
, short_desc    varchar(150)            NOT NULL
, description   varchar(1000)           NOT NULL
, note          text
);

CREATE TABLE assignments
( id            SERIAL PRIMARY KEY  NOT NULL
, class_id      INT                 NOT NULL REFERENCES class(id)
, user_id       INT                 NOT NULL REFERENCES user_account(id)
, title         VARCHAR(60)         NOT NULL
, description   VARCHAR(1000)       NOT NULL
, due_date      DATE                NOT NULL
, finished      BOOLEAN             NOT NULL);

CREATE TABLE notes
( id            SERIAL PRIMARY KEY  NOT NULL
, class_id      INT                 NOT NULL REFERENCES class(id)
, user_id       INT                 NOT NULL REFERENCES user_account(id)
, assign_id     INT                 NOT NULL REFERENCES assignments(id)
, note_title    VARCHAR(60)         
, note_content  text                NOT NULL
, date_modified DATE                NOT NULL
);

