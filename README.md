# GamerGrove
- Clarke Carpenter
- Austin Kim
- Kyle Hodges
- Cameron Ross

GamerGrove – A grove for gamers.

Deployed Website Link: https://gamergrove.gitlab.io/gamer-grove

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

## Project Initialization
To fully enjoy this application on your local machine, please make sure to follow these steps:
pull from branch
make env
1. Clone the repository down to your local machine
2. CD into the new project directory
3. Run `docker volume create postgres-data`
4. Run `docker volume create pg-admin`
5. Run `docker compose build`
6. Run `docker compose up`
7. Run `docker exec -it gamer-grove-ghi-1 bash`
8. Run `npm i html-react-parser`
9. Run `npm install @spaceymonk/react-radial-menu`
10. Run `npm install @galvanize-inc/jwtdown-for-react`
11. Run `npm install react-bootstrap`
12. Run `npm install react-slick slick-carousel`
13. Run `npm create vite@latest`
14. Exit the container's CLI, and enjoy GamerGrove to its fullest!

To run this application successfully, you will need the following 3rd Party API source:
- https://rawg.io/apidocs
