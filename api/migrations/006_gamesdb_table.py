steps = [
    [

        """
        CREATE TABLE gamesdb(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50),
        description TEXT,
        rating FLOAT,
        dates DATE,
        background_img VARCHAR(2500),
        Xbox BOOLEAN DEFAULT false,
        PlayStation BOOLEAN DEFAULT false,
        Nintendo BOOLEAN DEFAULT false,
        PC BOOLEAN DEFAULT false,
        rating_count FLOAT,
        rating_total FLOAT,
        genre VARCHAR(1500),
        developers VARCHAR(1500),
        rawg_pk VARCHAR(20) UNIQUE,
        reviews_count INTEGER
        );
        """,
        """
        DROP TABLE gamesdb;
        """
    ],
]
