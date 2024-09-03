# GamerGrove
- Austin Kim
- Cameron Ross
- Clarke Carpenter
- Kyle Hodges

GamerGrove – A grove for gamers

**Deployed Website Link:** https://gamergrove.gitlab.io/gamer-grove

## UI Screenshots For Code Sample for Airbnb Reviewers

![Alt text](<User Dashboard Created Boards.png>)
![Alt text](<Games Added to Board.png>)


## Design
- [API Design](docs/api-design.md)
- [SQL Tables Schema](docs/data-model-design.md)
- [GHI Design](docs/ghi-design.md)
- [Integrations](docs/integrations.md)

## Intended market
We are targeting gamer enthusiasts who are looking for an easy and user-friendly way to organize, procure, inspect, and collaborate on games they have interest in.

## Functionality
- Visitors to the site can:
  - browse games that are pre-loaded into the site by platform and
   genre
  - view the details of any game (i.e. description, screenshots, ratings,
   user-written reviews, etc.)
  - search for more games by keyword (will automatically be added to
   website's database)
  - click on a link to purchase the game on the platform of their choice

- Users can (in addition to the above):
  - create/update/delete an account
  - create/update/delete a board to which they can add games
  - add/remove games to their wishlist
  - write/update/delete reviews for a game
  - upvote/downvote reviews for a game
  - can access any of the above features from either a user dashboard or
   an 'options' pointer menu

## Getting Started
To fully enjoy this application on your local machine, please make sure to follow these steps:

**Make sure you have Docker, Git, and Node.js 18.2 or above**

1. Clone the repository down to your local machine:
```
git clone https://github.com/austintkim/GamerGrove.git
```

2. CD into the new project directory

3. Create an .env file at the root level of this project directory with the following information:
```
SIGNING_KEY_FROM_ENV_FILE=5jkl3n43iojo5dsa
DATABASE_URL_FROM_ENV_FILE=postgresql://gamergrove:password@postgres/gamergrove_db
RAWG_API_KEY=0c4556270545498782c9a942f38cb48a
VITE_API_HOST=http://localhost:5173/
```

![alt text](image-1.png)

4. CD into the ghi directory and create an .env file with the following information:
```
VITE_API_HOST=http://localhost:8000
VITE_RAWG_API_KEY=0c4556270545498782c9a942f38cb48a
VITE_PUBLIC_URL=

```

![alt text](image-2.png)

5. Run the following commands in the terminal:
```
docker volume create postgres-data
docker volume create pg-admin
docker compose build
docker compose up
docker exec -it gamergrove-ghi-1 bash
npm i html-react-parser
npm install @spaceymonk/react-radial-menu
npm install @galvanize-inc/jwtdown-for-react
npm install react-bootstrap
npm install react-slick slick-carousel
```
6. Exit out of the container's CLI

7. View the project in the browser: http://localhost:5173/

8. Explore and enjoy!

**Important Note**:
- To run this application successfully, you will need the following 3rd Party API source:** https://rawg.io/apidocs
- In steps 3 and 4 of the "Getting Started" section above, I have provided my personal API key for your convenience
  - Note that I am subscribed to the basic plan, which allows for up to 1,000 requests a day (30,000 requests per month)
- Feel free to use the link provided above to obtain your own Rawg API key and use that value in the two aforementioned .env files that you must add to the codebase before creating your Docker containers and launching the application in the browser
  - No card or payment details are required.
