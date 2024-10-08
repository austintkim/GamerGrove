from fastapi import (APIRouter, Depends)
from typing import Union, List
from queries.replies import (
    ReplyInBase,
    ReplyInUpdate,
    ReplyOut,
    ReplyQueries,
    HttpError
    )
from queries.reviews import (
    ReviewQueries
)
from authenticator import authenticator

router = APIRouter()


@router.post("/api/replies", response_model=Union[ReplyOut, HttpError])
async def create_reply(
    reply: ReplyInBase,
    queries: ReplyQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = account_data["id"]
    reply_dict = reply.dict()
    reply_dict["account_id"] = account_id

    review_id = reply_dict["review_id"]
    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]
    review_dict["replies_count"] += 1
    review_queries.update_review(review_id, review_dict)

    created_reply = queries.create_reply(reply_dict)
    return created_reply


@router.get("/api/replies/users/{account_id}", response_model=Union[List[ReplyOut], HttpError])
async def get_user_replies(
    queries: ReplyQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    account_id = account_data["id"]
    return queries.get_user_replies(account_id)


@router.get("/api/replies/reviews/{review_id}", response_model=Union[List[ReplyOut], HttpError])
async def get_review_replies(
    review_id: int,
    queries: ReplyQueries = Depends(),
):
    return queries.get_review_replies(review_id)


@router.get("/api/replies/{id}", response_model=ReplyOut)
async def get_reply(
    id: int,
    queries: ReplyQueries = Depends(),
):
    return queries.get_reply(id)


@router.delete("/api/replies/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_reply(
    id: int,
    queries: ReplyQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    reply_details = queries.get_reply(id).dict()
    review_id = reply_details["review_id"]
    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]
    review_dict["replies_count"] -= 1
    review_queries.update_review(review_id, review_dict)

    account_id = account_data["id"]
    return queries.delete_reply(id, account_id)

    ### VERIFY/FIX CODE TO UPDATE REPLIES COUNT ON ASSOCIATED REVIEW


@router.put("/api/replies/{id}/{account_id}", response_model=Union[ReplyOut, HttpError])
async def update_reply(
    id: int,
    reply: ReplyInUpdate,
    queries: ReplyQueries = Depends(),
    account_data: dict = Depends(authenticator.get_current_account_data)
):
    reply_details = queries.get_reply(id).dict()

    account_id = account_data["id"]
    review_id = reply_details["review_id"]
    reply_id = reply_details["reply_id"]

    reply_dict = reply.dict()
    reply_dict["account_id"] = account_id
    reply_dict["review_id"] = review_id
    reply_dict["reply_id"] = reply_id

    updated_reply = queries.update_reply(id, reply_dict)
    return updated_reply

    ### ADD CODE TO UPDATE REPLIES COUNT ON ASSOCIATED REVIEW
