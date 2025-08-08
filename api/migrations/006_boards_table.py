steps = [
    [
        """
        CREATE TABLE boards(
        id SERIAL PRIMARY KEY,
        board_name VARCHAR(255),
        description TEXT,
        cover_photo VARCHAR(255),
        game_count INT,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE

        );
        """,
        """
        DROP TABLE boards;
        """,
    ],
]
