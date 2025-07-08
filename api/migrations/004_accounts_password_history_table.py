steps = [
    [
        """
        CREATE TABLE accounts_password_history(
        id SERIAL PRIMARY KEY,
        account_id INT NOT NULL,
        hashed_password VARCHAR(500) NOT NULL,
        is_current BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE

        );
        """,
        """
        DROP TABLE accounts_password_history;
        """,
    ],
]
