# GamerGrove Data Models

## Icon Table

| name              | type                                     | unique   | optional |
| ---------------- | ------                                    | ------   | -------- |
| id               | Serial Primary Key                        | yes      | no       |
| name             | Varchar(255)                              | yes      | no       |
| icon_url         | text                                      | no       | no       |



## Accounts Table

| name             | type                                       | unique   | optional |
| ---------------- | ------                                     | ------   | -------- |
| id               | Serial Primary Key                         | yes      | no       |
| username         | VARCHAR(50)                                | yes      | no       |
| hashed_password  | VARCHAR(500)                               | yes      | no       |
| first_name       | VARCHAR(225)                               | no       | no       |
| last_name        | VARCHAR(225)                               | yes      | no       |
| email            | VARCHAR(255)                               | yes      | no       |
| icon_id          | Int                                        | no       | no       |
| icon_id          | reference to icons(id)                     | no       | no       |


## Gamesdb Table

| name             | type                                       | unique   | optional |
| ---------------- | ------                                     | ------   | -------- |
| id               | Serial Primary Key                         | yes      | no       |
| name             | VARCHAR(50)                                | yes      | no       |
| description      | text                                       | no       | no       |
| rating           | float                                      | no       | no       |
| dates            | date                                       | yes      | no       |
| background_img   | VARCHAR(2500)                              | no       | no       |
| Xbox             | bool default false                         | no       | yes      |
| PlayStation      | bool default false                         | no       | yes      |
| Nintendo         | bool default false                         | no       | yes      |
| PC               | bool default false                         | yes      | yes      |
| rating_count     | float                                      | no       | no       |
| rating_total     | float                                      | no       | no       |
| genre            | VARCHAR(1500)                              | no       | no       |
| developers       | VARCHAR(1500)                              | no       | no       |
| rawg_pk          | VARCHAR(20)                                | no       | yes      |
| reviews_count    | int                                        | no       | no       |


## Boards Table

| name             | type                                       | unique   | optional |
| ---------------- | ------                                     | ------   | -------- |
| id               | Serial Primary Key                         | yes      | no       |
| board_name       | VARCHAR(255)                               | yes      | no       |
| description      | text                                       | no       | no       |
| cover_photo      | VARCHAR(255)                               | no       | no       |
| game_count       | int                                        | no       | no       |
| account_id       | int                                        | yes      | no       |
| account_id       |reference to accounts(id) on Delete Cascade | no       | no       |


## Libraries Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| wishlist         | bool default false                          | yes      | yes      |
| account_id       | int                                         | yes      | no       |
| account_id       | reference to accounts(id) on Delete Cascade | yes      | no       |
| game_id          | int                                         | yes      | no       |
| game_id          | reference to gamesdb(id)                    | yes      | no       |
| board_id         | int                                         | yes      | no       |
| board_id         | reference to boards(id)                     | yes      | no       |



## Reviews Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| body             | text                                        | no       | no       |
| title            | VARCHAR(255)                                | no       | no       |
| account_id       | int                                         | yes      | no       |
| account_id       | reference to accounts(id) on Delete Cascade | yes      | no       |
| game_id          | int                                         | yes      | no       |
| game_id          | reference to gamesdb(id)                    | yes      | no       |
| replies_count    | int default 0                               | no       | no       |
| upvote_count     | int default 0                               | no       | no       |
| rating           | int                                         | no       | no       |



## Replies Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| body             | text                                        | no       | no       |
| account_id       | int                                         | yes      | no       |
| review_id        | int                                         | yes      | no       |
| review_id        | reference to reviews(id) on Delete Cascade  | yes      | no       |


## Votes Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| account_id       | reference to accounts(id) on Delete Cascade | yes      | no       |
| account_id       | int                                         | yes      | no       |
| review_id        | int                                         | yes      | no       |
| review_id        | reference to reviews(id) on Delete Cascade  | yes      | no       |
| upvote           | bool                                        | no       | yes      |
| downvote         | bool                                        | no       | yes      |


## Storedb Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| platform         | VARCHAR(50)                                 | no       | no       |
| url              | VARCHAR(225)                                | yes      | no       |
| rawg_pk          | VARCHAR(20)                                 | yes      | no       |



## Screenshots Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| image_url        | VARCHAR(225)                                | no       | no       |
| rawg_pk          | VARCHAR(20)                                 | yes      | no       |


## Uploads Table

| name             | type                                        | unique   | optional |
| ---------------- | ------                                      | ------   | -------- |
| id               | Serial Primary Key                          | yes      | no       |
| image_url        | VARCHAR(225)                                | no       | no       |
| account_id       | int                                         | yes      | no       |
| account_id       | reference to accounts(id) on Delete Cascade | yes      | no       |
| board_id         | int                                         | yes      | no       |
| board_id         | reference to boards(id)                     | yes      | no       |
