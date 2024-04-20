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
