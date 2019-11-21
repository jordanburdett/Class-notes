drop table user_account cascade;
drop table class CASCADE;

CREATE TABLE user_account
( id            SERIAL PRIMARY KEY NOT NULL
, first_name    VARCHAR(30)        NOT NULL
, last_name     VARCHAR(30)        NOT NULL
, email         VARCHAR(30)        NOT NULL
, password      VARCHAR(255)       NOT NULL
);

CREATE TABLE class
( id            SERIAL PRIMARY KEY      NOT NULL
, user_id       INT                     NOT NULL REFERENCES user_account(id)
, class_name    varchar(40) UNIQUE      NOT NULL
, short_desc    varchar(150)            NOT NULL
, description   varchar(1000)           NOT NULL
, note          varchar(10000)
);



INSERT INTO user_account
( first_name
, last_name
, email
, password
)
VALUES
( 'Jordan'
, 'Burdett'
, 'jordan@burdett.us'
, 'password');


INSERT INTO class
( user_id
, class_name
, short_desc
, DESCRIPTION
)
VALUES
( 1
, 'CS-313'
, 'Web Engineering II'
, 'This course builds upon Web Engineering I allowing students to create more advanced web applications and services. The emphasis of this course will be on server-side technologies and n-tier applications using relational database technology. Different server-side technologies will be used for creating dynamic n-tier web applications. Client side technologies will be enhanced and combined with server-side technologies to create rich; web applications.

At the end of this semester successful students will be able to:

1. Create advanced web applications and services through server side programming and relational database technology.
2. Build rich, dynamic, n-tier web applications.
3. Demonstrate the ability and recognize the importance of separating web applications into tiers.
4. Recognize the fundamentals behind and understand the advantages and disadvantages of the many different and competing web technologies.
5. Independently learn and apply new technologies.
'
);

INSERT INTO class
( user_id
, class_name
, short_desc
, DESCRIPTION
)
VALUES
( 1
, 'CS-308'
, 'Technical Communication'
, 'Learn how to communicate! yay!'
);

select user_id, class_name, short_desc from class
where user_id = 1;