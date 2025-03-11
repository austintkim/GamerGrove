steps = [
    [

        """
        CREATE TABLE votes(
        id SERIAL PRIMARY KEY,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        review_id INT NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        upvote BOOLEAN,
        );

        """,
        """
        DROP TABLE votes;
        """
    ],

]
