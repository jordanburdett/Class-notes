drop table user_account cascade;
drop table class CASCADE;
drop table assignments CASCADE;
drop table notes CASCADE;

CREATE TABLE user_account
( id            SERIAL PRIMARY KEY NOT NULL
, first_name    VARCHAR(30)        NOT NULL
, last_name     VARCHAR(30)        NOT NULL
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


/* INSERTS */
INSERT INTO user_account
( first_name
, last_name
, username
, password
)
VALUES
( 'Jordan'
, 'Burdett'
, 'jordan'
, '$2b$10$iY5fbxstpLjCLJtjasHkvuM7.2eH7x10qQyO7yVOrhO5MNoRkGaCa');


INSERT INTO class
( user_id
, class_name
, short_desc
, DESCRIPTION
, NOTE
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
, 
'THIS IS A CLASS NOTE THAT I WROTE FOR TESTING PURPOSES'
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

INSERT INTO class
( user_id
, class_name
, short_desc
, DESCRIPTION
)
VALUES
( 1
, 'CS-246'
, 'Software Design and Development'
, 'android...'
);


INSERT INTO assignments
( class_id
, user_id
, title
, description
, due_date
, finished
) VALUES
( 1
, 1
, 'Project 1'
, 'Create a web application using PHP'
, '2019-12-1'
, FALSE);

INSERT INTO assignments
( class_id
, user_id
, title
, description
, due_date
, finished
) VALUES
( 1
, 1
, 'Project 2'
, 'Create a web application using node.js'
, '2019-12-1'
, false);

INSERT INTO assignments
( class_id
, user_id
, title
, description
, due_date
, finished
) VALUES
( 2
, 1
, 'Team Proposal'
, 'Create a proposal of a technical problem that needs fixing.....'
, '2019-12-8'
, false);

INSERT INTO notes
( class_id
, assign_id
, user_id
, note_title
, note_content
, date_modified)
 VALUES 
( 1
, 1
, 1
, 'Project Ideas'
, '1. recreate the first project that i did...\n2. Create a class assignment/scheduling application.\n3. Drop the class\n4. Drop out of College...'
, CURRENT_DATE);

/* query tests */
select user_id, class_name, short_desc from class
where user_id = 1;


