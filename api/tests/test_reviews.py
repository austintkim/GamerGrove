# Import necessary modules
from fastapi.testclient import TestClient
from main import app
from queries.reviews import ReviewOut, ReviewQueries

# Init TestClient with FastAPI app
client = TestClient(app)


class MockReviewQueries:
    """
    a mock version of review queries
    """

    def get_review(self, id: int):
        # return a dictionary of mock review properties
        return ReviewOut(
            id=id,
            game_id=1,
            account_id=1,
            title="title 1",
            body="body 1",
            replies_count="1",
            upvote_count="1",
            rating="1",
        )


def test_get_review():
    """
    test the get review endpoint

    """
    app.dependency_overrides[ReviewQueries] = MockReviewQueries
    id = 1

    response = client.get(f"/api/reviews/{id}")

    assert response.status_code == 200

    review = response.json()
    assert len(review) == 8

    assert review == {
        "id": id,
        "game_id": 1,
        "account_id": 1,
        "title": "title 1",
        "body": "body 1",
        "replies_count": 1,
        "upvote_count": 1,
        "rating": 1,
    }

    app.dependency_overrides = {}
