steps = [
    [
        """
        CREATE TABLE screenshots (
        id SERIAL PRIMARY KEY,
        image_url VARCHAR(255),
        rawg_pk VARCHAR(20)
        );
        """,
        """
        DROP TABLE screenshots;
        """,
    ],
]
