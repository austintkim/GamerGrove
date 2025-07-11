from fastapi.testclient import TestClient
from queries.libraries import LibraryOut, LibraryQueries

from api.main import app

client = TestClient(app)


class MockLibraryQueries:
    """
    Mock version of LibraryQueries
    """

    def get_library_entry(self, id: int):
        return LibraryOut(id=1, wishlist=False, game_id=15, board_id=2, account_id=3)


def test_get_library_entry():
    """
    Test to get a library entry
    """

    # Arrange
    app.dependency_overrides[LibraryQueries] = MockLibraryQueries
    id = 1

    # Act
    resposne = client.get(f"/api/libraries/{id}")

    # Assert
    assert resposne.status_code == 200
    data = resposne.json()
    assert data["board_id"] == 2
