steps = [
    [
        """
        CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        body TEXT,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        review_id INT NOT NULL,
        FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
        comment_id INT,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE OR REPLACE FUNCTION update_last_update_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.last_update = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER set_last_update_comments
        BEFORE UPDATE ON comments
        FOR EACH ROW
        EXECUTE FUNCTION update_last_update_column();
        """,
        """
        DROP TABLE comments;
        DROP FUNCTION update_last_update_column;
        """,
    ],
]
