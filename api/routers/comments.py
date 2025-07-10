from typing import Any, Union

from authenticator import authenticator
from fastapi import APIRouter, Depends
from queries.comments import (
    CommentIn,
    CommentInBase,
    CommentInUpdate,
    CommentOut,
    CommentQueries,
    HttpError,
)
from queries.reviews import (
    ReviewIn,
    ReviewQueries,
)

router = APIRouter()


@router.post("/api/comments", response_model=Union[CommentOut, HttpError])
async def create_comment(
    comment: CommentInBase,
    queries: CommentQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    account_id = account_data["id"]
    username = account_data["username"]

    comment_dict = comment.dict()
    comment_dict["account_id"] = account_id

    comment_in = CommentIn(**comment_dict)

    review_id = comment_dict["review_id"]
    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]
    review_dict["comment_count"] += 1

    review_in = ReviewIn(**review_dict)

    review_queries.update_review(review_id, username, review_in)

    created_comment = queries.create_comment(comment_in)
    return created_comment


@router.get(
    "/api/comments/users/{account_id}",
    response_model=Union[list[CommentOut], HttpError],
)
async def get_user_comments(
    queries: CommentQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    account_id = account_data["id"]
    return queries.get_user_comments(account_id)


@router.get(
    "/api/comments/reviews/{review_id}",
    response_model=Union[list[CommentOut], HttpError],
)
async def get_review_comments(
    review_id: int,
    queries: CommentQueries = Depends(),
):
    return queries.get_review_comments(review_id)


@router.get("/api/comments/{id}", response_model=CommentOut)
async def get_comment(
    id: int,
    queries: CommentQueries = Depends(),
):
    return queries.get_comment(id)


@router.delete("/api/comments/{id}/{account_id}", response_model=Union[bool, HttpError])
async def delete_comment(
    id: int,
    queries: CommentQueries = Depends(),
    review_queries: ReviewQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    account_id = account_data["id"]
    username = account_data["username"]

    comment_details = queries.get_comment(id).dict()

    review_id = comment_details["review_id"]
    review_dict = review_queries.get_review(review_id).dict()
    del review_dict["id"]
    review_dict["comment_count"] -= 1
    review_in = ReviewIn(**review_dict)

    review_queries.update_review(review_id, username, review_in)

    return queries.delete_comment(id, account_id)


@router.put(
    "/api/comments/{id}/{account_id}", response_model=Union[CommentOut, HttpError]
)
async def update_comment(
    id: int,
    comment: CommentInUpdate,
    queries: CommentQueries = Depends(),
    account_data: dict[str, Any] = Depends(authenticator.get_current_account_data), #type: ignore
):
    comment_details = queries.get_comment(id).dict()

    account_id = account_data["id"]
    review_id = comment_details["review_id"]
    comment_id = comment_details["comment_id"]

    comment_dict = comment.dict()
    comment_dict["account_id"] = account_id
    comment_dict["review_id"] = review_id
    comment_dict["comment_id"] = comment_id

    comment_in = CommentIn(**comment_dict)

    updated_comment = queries.update_comment(id, comment_in)
    return updated_comment
