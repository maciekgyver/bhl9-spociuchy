CREATE TABLE activities (
    id SERIAL PRIMARY KEY NOT NULL,
    question text,
    created_at timestamp,
    expires_at timestamp,
    group_id int
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY NOT NULL,
    group_name text NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username text,
    first_name text,
    last_name text,
    card_number text
);

CREATE TABLE users_groups (
    user_id int REFERENCES users(id),
    group_id int REFERENCES groups(id),
    PRIMARY KEY (user_id, group_id)
);

CREATE TABLE users_activities (
    user_id int REFERENCES users(id),
    activity_id int REFERENCES activities(id),
    PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY NOT NULL,
    user_id int REFERENCES users(id),
    activity_id int REFERENCES activities(id),
    vote boolean
);
