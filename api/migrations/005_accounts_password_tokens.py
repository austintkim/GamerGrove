steps = [
    [
        """
        CREATE TABLE accounts_password_tokens(
        id SERIAL PRIMARY KEY,
        email VARCHAR(255),
        token_text VARCHAR(255) UNIQUE,
        time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used BOOLEAN DEFAULT FALSE
        );
        """,
        """
        DROP TABLE accounts_password_tokens;
        """,
    ],
]
