from fastapi import (APIRouter, Depends, HTTPException, status)
from typing import Union
from queries.reviews import (
    ReviewInBase,
    ReviewInUpdate,
    ReviewOut,
    ReviewQueries,
    HttpError
)
from queries.games import (
    GameQueries
)
from authenticator import authenticator
from typing import List


router = APIRouter()


def authenticate_user(review_data: dict):
    account_id = review_data["id"]
    if account_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized access"
        )
    return account_id


@router.get("/api/reviews/games/{game_id}", response_model=Union[List[ReviewOut], HttpError])
async def get_game_reviews(
    game_id: int,
    queries: ReviewQueries = Depends(),
):
    return queries.get_game_reviews(game_id)


@router.get("/api/reviews/users/{account_id}", response_model=Union[List[ReviewOut], HttpError])
async def get_user_reviews(

    queries: ReviewQueries = Depends(),
    review_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = authenticate_user(review_data)
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
    account_data: dict = Depends(authenticator.get_current_account_data),
):
    account_id = authenticate_user(account_data)

    review_dict = review.dict()

    game_id = review_dict["game_id"]
    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["reviews_count"] += 1

    rating = review_dict["rating"]
    game_dict["rating_count"] += 1
    game_dict["rating_total"] += rating
    game_dict["rating"] = game_dict["rating_total"]/game_dict["rating_count"]

    games_queries.update_game(game_id, game_dict)

    review_dict["account_id"] = account_id
    review_dict["replies_count"] = 0
    review_dict["upvote_count"] = 0

    created_review = queries.create_review(review_dict)
    return created_review


@router.delete("/api/reviews/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_review(
    id: int,
    queries: ReviewQueries = Depends(),
    games_queries: GameQueries = Depends(),
    review_data: dict = Depends(authenticator.get_current_account_data)
):
    review_details = queries.get_review(id).dict()
    game_id = review_details["game_id"]
    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["reviews_count"] -= 1

    rating = review_details["rating"]
    game_dict["rating_count"] -= 1
    game_dict["rating_total"] -= rating
    game_dict["rating"] = game_dict["rating_total"]/game_dict["rating_count"]

    games_queries.update_game(game_id, game_dict)

    account_id = authenticate_user(review_data)
    return queries.delete_review(id, account_id)


@router.put("/api/reviews/{id}/{account_id}", response_model=Union[ReviewOut, HttpError])
async def update_review(
    id: int,
    review: ReviewInUpdate,
    queries: ReviewQueries = Depends(),
    games_queries: GameQueries = Depends(),
    review_data: dict = Depends(authenticator.get_current_account_data),
):
    review_dict = review.dict()

    review_details = queries.get_review(id).dict()

    account_id = authenticate_user(review_data)

    game_id = review_details["game_id"]
    previous_rating = review_details["rating"]
    rating = review_dict["rating"]

    game_dict = games_queries.get_game(game_id).dict()
    del game_dict["id"]
    game_dict["rating_total"] -= previous_rating
    game_dict["rating_total"] += rating
    game_dict["rating"] = game_dict["rating_total"]/game_dict["rating_count"]
    games_queries.update_game(game_id, game_dict)

    replies_count = review_details["replies_count"]
    upvote_count = review_details["upvote_count"]

    review_dict["account_id"] = account_id
    review_dict["game_id"] = game_id
    review_dict["replies_count"] = replies_count
    review_dict["upvote_count"] = upvote_count

    updated_review = queries.update_review(id, review_dict)
    return updated_review
