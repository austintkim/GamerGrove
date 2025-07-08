from fastapi.testclient import TestClient
from main import app
from queries.icons import IconOut, IconQueries

client = TestClient(app)


class TestIconQueries:
    def get_icon(self, id: int):
        return IconOut(
            id=100, name="Icon Test", icon_url="https://fakeurl.cc/fakeicon.png"
        )


def test_get_icon():
    """
    Test the get icons endpoint
    """
    # Arrange
    app.dependency_overrides[IconQueries] = TestIconQueries
    id = 100

    # Act
    response = client.get(f"/api/icons/{id}")
    assert response.status_code == 200

    icon = response.json()
    assert len(icon) == 3

    # Assert
    assert icon == {
        "id": 100,
        "name": "Icon Test",
        "icon_url": "https://fakeurl.cc/fakeicon.png",
    }

    app.dependency_overrides = {}
