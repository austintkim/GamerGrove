steps = [
    [
        """
        CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        body TEXT,
        title VARCHAR(255),
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        username VARCHAR(255),
        game_id INT NOT NULL,
        FOREIGN KEY (game_id) REFERENCES gamesdb(id),
        comment_count INT DEFAULT 0,
        upvote_count INT DEFAULT 0,
        rating INT,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE OR REPLACE FUNCTION update_last_update_column()
        RETURNS TRIGGER AS $$
        BEGIN
            IF (OLD.title IS DISTINCT FROM NEW.title OR OLD.body IS DISTINCT FROM NEW.body) THEN
                NEW.last_update = CURRENT_TIMESTAMP;
            ELSE
                NEW.last_update = OLD.last_update;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE TRIGGER set_last_update
        BEFORE UPDATE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_last_update_column();

        """,
        """
        DROP TABLE reviews;
        DROP FUNCTION update_last_update_column;
        """
    ],
]
