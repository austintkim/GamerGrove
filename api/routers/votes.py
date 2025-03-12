from fastapi import (APIRouter, Depends, status, HTTPException)
from typing import Union, List
from queries.votes import (
    VoteInBase,
    VoteInUpdate,
    VoteOut,
    VoteQueries,
    HttpError
)
from queries.reviews import (
    ReviewQueries
)
from authenticator import authenticator

router = APIRouter()


@router.post("/api/votes", response_model=Union[VoteOut, HttpError])
async def create_vote(
    vote: VoteInBase,
    queries: VoteQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = account_data["id"]
    vote_dict = vote.dict()
    vote_dict["account_id"] = account_id

    review_id = vote_dict["review_id"]
    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]

    if vote_dict["upvote"] is True:
        review_dict["upvote_count"] += 1
    else:
        review_dict["upvote_count"] -= 1

    review_queries.update_review(review_id, review_dict)

    created_vote = queries.create_vote(vote_dict)
    return created_vote


@router.get("/api/votes/users/{account_id}", response_model=Union[List[VoteOut], HttpError])
async def get_user_votes(
    queries: VoteQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = account_data["id"]
    return queries.get_user_votes(account_id)


@router.get("/api/votes/reviews/{review_id}", response_model=Union[List[VoteOut], HttpError])
async def get_review_votes(
    review_id: int,
    queries: VoteQueries = Depends(),
):
    return queries.get_review_votes(review_id)

@router.get("/api/votes/{id}", response_model=Union[VoteOut, HttpError])
async def get_vote(
    id: int,
    queries: VoteQueries = Depends(),
):
    return queries.get_vote(id)

# Need to add delete_vote endpoints

@router.put("/api/votes/{id}/{account_id}", response_model=Union[VoteOut, HttpError])
async def update_vote(
    id: int,
    vote: VoteInUpdate,
    queries: VoteQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    vote_details = queries.get_vote(id).dict()

    account_id = account_data["id"]
    review_id = vote_details["review_id"]

    vote_dict = vote.dict()
    vote_dict["account_id"] = account_id
    vote_dict["review_id"] = review_id

    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]

    if vote_dict["upvote"] is True and vote_details["upvote"] is False:
        review_dict["upvote_count"] += 1
    elif vote_dict["upvote"] is False and vote_details["upvote"] is True:
        review_dict["upvote_count"] -= 1
    review_queries.update_review(review_id, review_dict)

    updated_vote = queries.update_vote(id, vote_dict)
    return updated_vote
