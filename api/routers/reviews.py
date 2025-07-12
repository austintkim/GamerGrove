from typing import Any, Union

from fastapi import APIRouter, Depends

from api.authenticator import authenticator

from ..queries.games import GameIn, GameQueries
from ..queries.reviews import HttpError, ReviewIn, ReviewInBase, ReviewInUpdate, ReviewOut, ReviewQueries

router = APIRouter()


@router.get("/api/reviews/games/{game_id}", response_model=Union[list[ReviewOut], HttpError])
async def get_game_reviews(
    game_id: int,
    queries: ReviewQueries = Depends(),
):
    return queries.get_game_reviews(game_id)


@router.get("/api/reviews/users/{account_id}", response_model=Union[list[ReviewOut], HttpError])
async def get_user_reviews(
    queries: ReviewQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type:ignore
):
    account_id = account_data["id"]
    return queries.get_user_reviews(account_id)


@router.get("/api/reviews/{id}", response_model=Union[ReviewOut, HttpError])
async def get_review(
    id: int,
    queries: ReviewQueries = Depends(),
):
    return queries.get_review(id)


@router.post("/api/reviews", response_model=Union[ReviewOut, HttpError])
async def create_review(
    review: ReviewInBase,
    queries: ReviewQueries = Depends(),
    games_queries: GameQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type:ignore
):
    account_id = account_data["id"]

    review_dict = review.dict()

    game_id = review_dict["game_id"]
    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["reviews_count"] += 1

    rating = review_dict["rating"]
    game_dict["rating_count"] += 1
    game_dict["rating_total"] += rating
    game_dict["rating"] = game_dict["rating_total"] / game_dict["rating_count"]

    game_in = GameIn(**game_dict)

    games_queries.update_game(game_id, game_in)

    review_dict["account_id"] = account_id
    username = account_data["username"]
    review_dict["comment_count"] = 0
    review_dict["upvote_count"] = 0

    review_in = ReviewIn(**review_dict)

    created_review = queries.create_review(username, review_in)
    return created_review


@router.delete("/api/reviews/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_review(
    id: int,
    queries: ReviewQueries = Depends(),
    games_queries: GameQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type:ignore
):
    review_details = queries.get_review(id).dict()
    game_id = review_details["game_id"]
    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["reviews_count"] -= 1

    rating = review_details["rating"]
    game_dict["rating_count"] -= 1
    game_dict["rating_total"] -= rating
    game_dict["rating"] = game_dict["rating_total"] / game_dict["rating_count"]

    game_in = GameIn(**game_dict)

    games_queries.update_game(game_id, game_in)

    account_id = account_data["id"]
    return queries.delete_review(id, account_id)


@router.put("/api/reviews/{id}/{account_id}", response_model=Union[ReviewOut, HttpError])
async def update_review(
    id: int,
    review: ReviewInUpdate,
    queries: ReviewQueries = Depends(),
    games_queries: GameQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data),  # type: ignore
):
    review_dict = review.dict()

    review_details = queries.get_review(id).dict()

    account_id = account_data["id"]
    game_id = review_details["game_id"]
    previous_rating = review_details["rating"]
    rating = review_dict["rating"]

    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["rating_total"] -= previous_rating
    game_dict["rating_total"] += rating
    game_dict["rating"] = game_dict["rating_total"] / game_dict["rating_count"]

    game_in = GameIn(**game_dict)

    games_queries.update_game(game_id, game_in)

    comment_count = review_details["comment_count"]
    upvote_count = review_details["upvote_count"]

    review_dict["account_id"] = account_id
    username = account_data["username"]
    review_dict["game_id"] = game_id
    review_dict["comment_count"] = comment_count
    review_dict["upvote_count"] = upvote_count

    review_in = ReviewIn(**review_dict)

    updated_review = queries.update_review(id, username, review_in)
    return updated_review
