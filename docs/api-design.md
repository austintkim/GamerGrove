# APIs

## Accounts

- **Method**: `POST`, `GET`, `GET`, `PUT`, `DELETE`,
- **Path**: `/token`, `/api/accounts`, `/api/accounts/{username}`, `/api/accounts/{id}/{username}`

Input:

```json
{
  "session_getter": query,
  "fastapi_token": string
}
```

Output:

```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "account": {
    "id": 0,
    "username": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "icon_id": 0
  }
}
```

Creating a new user, gets a token and authenticates. Saves a username, email, password, first name, last name and icon id.

## AUTH

- **Method**: `POST`, `DELETE`,
- **Path**: `/token`,

Input:

```json
{
  "username": string,
  "password": string
}
```

Output:

```json
{
  "access_token": string,
  "token_type": string
}
```

Logs in a User using a username and password, returning a access token.

## Boards

- Method: `GET`, `POST`, `GET`, `PUT`, `DELETE`
- Path: `/api/boards`, `/api/boards/{id}`, `/api/boards/{id}/{account_id}`,
        `/api/boards/users/{id}/{account_id}`

Input:

```json
{
  "board_name": "string",
  "description": "string",
  "cover_photo": "string"
}
```

Output:

```json
{
  "id": 0,
  "board_name": "string",
  "description": "string",
  "game_count": 0,
  "cover_photo": "string",
  "account_id": 0
}
```

The Boards api endpoint has everything to create a board, get a specific board, get all boards for a user, edit a board and to delete a board. Receiving a board name, description and cover photo. Returning an id, game count and recording the account id.

## Games

- Method: `GET`, `POST`, `PUT`, `GET`
- Path: `/api/games`, `/api/games/{id}`

Input:

```json
{
  "name": "string",
  "description": "string",
  "rating": 0,
  "dates": "2024-02-09",
  "background_img": "string",
  "Xbox": true,
  "PlayStation": true,
  "Nintendo": true,
  "PC": true,
  "rating_count": 0,
  "rating_total": 0,
  "genre": "string",
  "developers": "string",
  "rawg_pk": 0,
  "reviews_count": 0
}
```

Output:

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "rating": 0,
  "dates": "2024-02-09",
  "background_img": "string",
  "xbox": true,
  "playstation": true,
  "nintendo": true,
  "pc": true,
  "rating_count": 0,
  "rating_total": 0,
  "genre": "string",
  "developers": "string",
  "rawg_pk": 0,
  "reviews_count": 0
}
```

Gets game details, updates games, gets specific games and posts games into the database. From a third party API, RAWG.io, We decided to get the name, description, raing, dates, image, platforms, ratings, genres, developers, rawgs game id and reviews count. Our output gives each game their own id within our database.

## Icons

- Method: `GET`, `GET`
- Path: `/api/icons`, `/api/icons/{id}`

Input:

```json
{
  "id": int,
}
```

Output:

```json
{
  "id": 0,
  "name": "string",
  "icon_url": "string"
}
```

Gets a list or single icon from seeder date in the database. Given id will return an icons name, url and id.

## Libraries

- Method: `POST`, `DELETE`, `GET`, `GET`
- Path: `/api/libraries`, `/api/users/libraries/{account_id}`, `/api/libraries/{id}`,
        `/api/libraries/{id}/{account_id}`

Input:

```json
{
  "wishlist": true,
  "game_id": 0,
  "board_id": 0
}
```

Output:

```json
{
  "id": 0,
  "wishlist": true,
  "game_id": 0,
  "board_id": 0,
  "account_id": 0
}
```

An instance of a library is created whenever someone adds a game to their board or wishlist, and when anything is deleted, it is that instance to maintain whether something is both in the wishlist and a separate board.

## Screenshots

- **Method**: `GET`
- **Path**: `/api/screenshots/{rawg_pk}`

Input:

```json
{
  "rawg_pk": int
}
```

Output:

```json
[
  {
    "id": 0,
    "image_url": "string",
    "rawg_pk": 0
  }
]
```

Gets a list of screenshots from the database with a given rawg_pk.

## StoresDB

- **Method**: `GET`
- **Path**: `/api/stores/{rawg_pk}`

Input:

```json
{
  "rawg_pk": int
}
```

Output:

```json
[
  {
    "id": 0,
    "url": "string",
    "platform": "string",
    "rawg_pk": 0
  }
]
```

Gets a list of store urls from the database with a given rawg_pk, to have links to games for purchase.


## Reviews

- Method: `POST`, `DELETE`, `PUT`, `GET`, `GET`, `GET`
- Path: `/api/reviews`, `/api/reviews/users/{account_id}`, `/api/reviews/{id}`,
        `/api/reviews/{id}/{account_id}`, `/api/reviews/games/{account_id}`

Input:

```json
{
  "title": "string",
  "body": "string",
  "game_id": 0,
  "rating": 0
}
```

Output:

```json
{
  "id": 0,
  "game_id": 0,
  "account_id": 0,
  "title": "string",
  "body": "string",
  "replies_count": 0,
  "upvote_count": 0,
  "rating": 0
}
```

Reviews are created for games from a logged in user. You put in a title and body on a game details page capturing its game id, account id, a review id, replies count, rating, and upvote count.

## Votes

- Method: `POST`, `PUT`, `GET`, `GET`
- Path: `/api/votes`, `/api/votes/users/{account_id}`, `/api/votes/{id}/{account_id}`,
        `/api/votes/reviews/{account_id}`

Input:

```json
{
  "review_id": 0,
  "upvote": true,
  "downvote": true
}
```

Output:

```json
{
  "id": 0,
  "account_id": 0,
  "review_id": 0,
  "upvote": true,
  "downvote": true
}
```

Votes are created on reviews, you either give an upvote or downvote. The output will give an id and record the account id associated with that vote.
