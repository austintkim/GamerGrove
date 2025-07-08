steps = [
    [
        """
        CREATE TABLE accounts(
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        hashed_password VARCHAR(500),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        icon_id INT NOT NULL,
        FOREIGN KEY (icon_id) REFERENCES icons(id)
        
        );
        """,
        """
        DROP TABLE accounts;
        """,
    ],
]
