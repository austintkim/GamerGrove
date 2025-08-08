steps = [
    [
        """
        CREATE TABLE libraries(
        id SERIAL PRIMARY KEY,
        wishlist BOOLEAN DEFAULT false,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        game_id INT NOT NULL,
        FOREIGN KEY (game_id) REFERENCES gamesdb(id),
        board_id INT,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
        );

        """,
        """
        DROP TABLE libraries;
        """,
    ],
]
