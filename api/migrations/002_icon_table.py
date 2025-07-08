steps = [
    [
        """
        CREATE TABLE icons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        icon_url TEXT

        );
        """,
        """
        DROP TABLE icons;
        """,
    ],
]
