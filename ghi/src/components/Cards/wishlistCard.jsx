import { Link } from 'react-router-dom'
import './wishlistCard.css'
function WishlistCard({
    userData,
    libraryEntries,
    wishListGames,
    onGameRemoved,
}) {
    const handleClick = async (platform, rawg_pk) => {
        const storeUrl = await fetchStoreUrl(platform, rawg_pk)
        if (storeUrl) {
            window.location.href = storeUrl
        }
    }

    const fetchStoreUrl = async (platform, rawg_pk) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_HOST}/api/stores/${rawg_pk}`
            )
            const data = await response.json()
            for (const link of data) {
                if (link.platform === platform) {
                    return link.url
                }
            }
        } catch (error) {
            console.error('Cant find the store you are looking for', error)
            return null
        }
    }

    if (wishListGames.length === 0) {
        return (
            <p style={{ color: 'white' }}>
                {' '}
                No games saved to your wishlist yet.{' '}
            </p>
        )
    }

    const handleRemove = async (gameId) => {
        try {
            const filteredLibraryData = libraryEntries.filter(
                (libraryEntry) =>
                    libraryEntry.game_id === gameId &&
                    libraryEntry.wishlist === true
            )
            const url = `${import.meta.env.VITE_API_HOST}/api/libraries/${
                filteredLibraryData[0].id
            }/${userData.id}`
            const fetchConfig = {
                method: 'delete',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const response = await fetch(url, fetchConfig)
            if (response.ok) {
                onGameRemoved()
            } else {
                throw new Error('Failed to remove game from wishlist')
            }
        } catch (error) {
            console.error('Error removing game from wishlist:', error)
        }
    }

    return (
        <div>
            {wishListGames.map((game, index) => (
                <div key={`${game.id}-${index}`} className="wishlistcard">
                    <div className="wcard-content">
                        <div className="wcard-details">
                            <div className="wcontent-capsules">
                                <img
                                    className="icon2"
                                    src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                    width="5px"
                                    height="5px"
                                    alt="Icon 1"
                                    style={{ opacity: '0' }}
                                />
                                {game.xbox && (
                                    <img
                                        className="GDIcon"
                                        src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                        width="25px"
                                        height="25px"
                                        alt="Icon 1"
                                        type="button"
                                        onClick={() =>
                                            handleClick('Xbox', game.rawg_pk)
                                        }
                                    />
                                )}
                                {game.playstation && (
                                    <img
                                        className="GDIcon"
                                        src="https://banner2.cleanpng.com/20180710/xsc/aawqt4puu.webp"
                                        width="25px"
                                        height="25px"
                                        alt="Icon 2"
                                        type="button"
                                        onClick={() =>
                                            handleClick(
                                                'PlayStation',
                                                game.rawg_pk
                                            )
                                        }
                                    />
                                )}
                                {game.nintendo && (
                                    <img
                                        className="GDIcon"
                                        src="https://i.postimg.cc/R0qXLppc/image-3.png"
                                        width="25px"
                                        height="25px"
                                        alt="Icon 3"
                                        type="button"
                                        onClick={() =>
                                            handleClick(
                                                'Nintendo',
                                                game.rawg_pk
                                            )
                                        }
                                    />
                                )}
                                {game.pc && (
                                    <img
                                        className="GDIcon"
                                        src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
                                        width="25px"
                                        height="25px"
                                        alt="Icon 4"
                                        type="button"
                                        onClick={() =>
                                            handleClick('PC', game.rawg_pk)
                                        }
                                    />
                                )}
                            </div>
                            <p style={{ color: 'white' }} className="gamename">
                                {game.name}
                            </p>
                            <Link to={`/games/${game.id}`}>
                                <div
                                    className="wcard-photo"
                                    style={{ position: 'relative' }}
                                >
                                    <img
                                        src={game.background_img}
                                        alt={game.name}
                                    />
                                </div>
                            </Link>
                            <div
                                className="remove-button-wrapper"
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    margin: '10px',
                                }}
                            >
                                <button onClick={() => handleRemove(game.id)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default WishlistCard
