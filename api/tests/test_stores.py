from fastapi.testclient import TestClient
from main import app
from queries.stores import StoresOut, StoresQueries

client = TestClient(app)


# Arrange
class MockStoresQueries:
    def get_stores(self, rawg_pk: int):
        return [
            StoresOut(id=1, url="blueberryfin.co", platform="xbox", rawg_pk=rawg_pk),
            StoresOut(id=2, url="bananaberryfin.co", platform="playstation", rawg_pk=rawg_pk),
        ]


def test_get_stores():
    # Arrange
    app.dependency_overrides[StoresQueries] = MockStoresQueries
    rawg_pk = 423
    # Act
    response = client.get(f"/api/stores/{rawg_pk}")
    # Assert
    assert response.status_code == 200
    stores = response.json()
    assert len(stores) == 2
    # assert all(isinstance(store, dict) for store in stores)
    # Clean Up
    app.dependency_overrides = {}
