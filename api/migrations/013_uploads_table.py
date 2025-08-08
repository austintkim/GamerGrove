steps = [
    [
        """
        CREATE TABLE uploads (
        id SERIAL PRIMARY KEY,
        account_id INT NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        board_id INT NOT NULL,
        FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
        image_uri VARCHAR(255)
        );



        """,
        """
        DROP TABLE uploads;
        """,
    ],
]
