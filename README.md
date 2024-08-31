# GamerGrove
- Austin Kim
- Kyle Hodges
- Clarke Carpenter
- Cameron Ross

GamerGrove – A grove for gamers

**Deployed Website Link:** https://gamergrove.gitlab.io/gamer-grove

## Design
- [API Design](docs/api-design.md)
- [SQL Tables Schema](docs/data-model-design.md)
- [GHI Design](docs/ghi-design.md)
- [Integrations](docs/integrations.md)

## Intended market
We are targeting gamer enthusiasts who are looking for an easy and user-friendly way to organize, procure, inspect, and collaborate on games they have interest in.

## Functionality
- Visitors to the site can:
  - browse games that are already loaded into the site by platform and
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

3. Run the following commands in the terminal:
```
docker volume create postgres-data
docker volume create pg-admin
docker compose build
docker compose up
docker exec -it gamer-grove-ghi-1 bash
npm i html-react-parser
npm install @spaceymonk/react-radial-menu
npm install @galvanize-inc/jwtdown-for-react
npm install react-bootstrap
npm install react-slick slick-carousel
npm create vite@latest
```
4. Exit out of the container's CLI

5. View the project in the browser: http://localhost:5173/

6. Explore and enjoy!

Note that to run this application successfully, you will need the following 3rd Party API source:
- https://rawg.io/apidocs
