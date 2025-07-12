from datetime import datetime

from fastapi.testclient import TestClient

from api.main import app
from api.queries.reviews import ReviewOut, ReviewQueries

client = TestClient(app)


class MockReviewQueries:
    """
    A mock version of ReviewQueries
    """

    def get_review(self, id: int):
        return ReviewOut(
            id=id,
            game_id=1,
            account_id=1,
            username="test_user",
            title="title 1",
            body="body 1",
            comment_count=0,
            upvote_count=1,
            rating=1,
            date_created=datetime.now(),
            last_update=datetime.now(),
        )


def test_get_review():
    """
    Test the get review endpoint
    """
    app.dependency_overrides[ReviewQueries] = MockReviewQueries
    id = 1

    response = client.get(f"/api/reviews/{id}")
    assert response.status_code == 200

    review = response.json()
    assert len(review) == 11

    assert review["id"] == id
    assert review["game_id"] == 1
    assert review["account_id"] == 1
    assert review["username"] == "test_user"  # Matches mock
    assert review["title"] == "title 1"
    assert review["body"] == "body 1"
    assert review["comment_count"] == 0  # Matches mock
    assert review["upvote_count"] == 1
    assert review["rating"] == 1

    # Parse and compare datetime fields
    date_created = datetime.fromisoformat(review["date_created"])
    last_update = datetime.fromisoformat(review["last_update"])
    now = datetime.now()

    # Allow for a few seconds difference due to test execution time
    assert abs((now - date_created).total_seconds()) < 5
    assert abs((now - last_update).total_seconds()) < 5

    app.dependency_overrides = {}
