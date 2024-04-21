INSERT INTO groups (id, group_name)
VALUES (1, 'Wszyscy'),
    (2, 'Spociuchy'),
    (3, 'Programersi');

INSERT INTO users (id, username, first_name, last_name, card_number)
VALUES (1, 'jankowalski', 'Jan', 'Kowalski', '1234567890'),
    (2, 'annanowak', 'Anna', 'Nowak', '0987654321'),
    (3, 'piotrpawlak', 'Piotr', 'Pawlak', '1357924680'),
    (4, 'kamiladamczyk', 'Kamil', 'Adamczyk', '2468013579');

INSERT INTO users_groups (user_id, group_id)
VALUES (1, 1),
    (2, 1),
    (3, 1),
    (4, 1),
    (2, 2),
    (3, 2),
    (4, 3);
