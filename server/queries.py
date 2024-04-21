ACTIVITY_INSERT_QUERY = """
    INSERT INTO public.activities (
        question,
        created_at,
        expires_at,
        group_id
    ) VALUES (
        :question,
        :created_at,
        :expires_at,
        :group_id
    ) RETURNING id;
"""


VOTE_INSERT_QUERY = """
    INSERT INTO public.votes (
        activity_id,
        user_card_number,
        vote
    ) VALUES (
        :activity_id,
        :user_card_number,
        :vote
    );
"""

GET_ACTIVITIES_QUERY = """
    WITH usr AS (
        SELECT users.first_name || ' ' || users.last_name AS name,
            votes.activity_id
        FROM users
        JOIN votes ON votes.user_card_number = users.card_number
        WHERE votes.vote = true
    )
    SELECT activities.id, question, created_at, expires_at, activities.group_id, array_agg(usr.name) FROM public.activities
    LEFT JOIN usr ON activities.id = usr.activity_id
    GROUP BY activities.id, question, expires_at, activities.group_id
    ;
"""

GET_ACTIVITY_QUERY = """
    WITH usr AS (
        SELECT users.first_name || ' ' || users.last_name AS name,
            votes.activity_id
        FROM users
        JOIN votes ON votes.user_card_number = users.card_number
        WHERE votes.vote = true
    )
    SELECT activities.id, question, created_at, expires_at, activities.group_id, array_agg(usr.name) FROM public.activities
    LEFT JOIN usr ON activities.id = usr.activity_id
    WHERE activities.id = :activity_id
    GROUP BY activities.id, question, expires_at, activities.group_id
    ;
"""

GET_ACTIVE_ACTIVITIY_QUERY = """
    SELECT activities.id, question, expires_at, activities.group_id FROM public.activities
    JOIN public.groups ON activities.group_id = groups.id
    JOIN public.users_groups ON groups.id = users_groups.group_id
    JOIN public.users ON users_groups.user_id = users.id
    WHERE public.users.card_number = :card_number AND expires_at > :current_timestamp
    ORDER BY expires_at DESC LIMIT 1;
"""

GET_ACTIVE_ACTIVITIY_ONLY_TS_QUERY = """
    SELECT activities.id, question, created_at, expires_at, activities.group_id FROM public.activities
    WHERE expires_at > :current_timestamp
    ORDER BY expires_at DESC LIMIT 1;
"""