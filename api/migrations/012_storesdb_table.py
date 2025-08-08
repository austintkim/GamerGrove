steps = [
    [
        """
        CREATE TABLE storesdb(
        id SERIAL PRIMARY KEY,
        platform VARCHAR(50),
        url VARCHAR(255),
        rawg_pk INT NOT NULL
        );


        """,
        """
        DROP TABLE storesdb;
        """,
    ],
]
