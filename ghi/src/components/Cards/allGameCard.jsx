import { useEffect, useState, useRef } from 'react'
import { useAuthContext } from '@galvanize-inc/jwtdown-for-react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuItem, SubMenu } from '@spaceymonk/react-radial-menu'
import { Link } from 'react-router-dom'
import parse from 'html-react-parser'
import './allGameCard.css'
import sparkles from '../../assets/sparkles.gif'

function AllGameCard({ games }) {
    const navigate = useNavigate()
    const { token } = useAuthContext()
    const [id, setId] = useState('')
    const [show, setShow] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShow(false)
            }
        }

        if (show) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [show])

    const [boardDataList, setBoardDataList] = useState([])
    const [gameInWishList, setGameInWishList] = useState(null)

    const handleOptionsClick = async (gameId) => {
        setGameInWishList(false)

        const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`

        const config = {
            credentials: 'include',
        }

        try {
            const tokenResponse = await fetch(tokenUrl, config)
            const userData = await tokenResponse.json()
            if (userData) {
                const libraryUrl = `${
                    import.meta.env.VITE_API_HOST
                }/api/users/libraries/${userData.account.id}`
                const boardUrl = `${
                    import.meta.env.VITE_API_HOST
                }/api/boards/users/${userData.account.id}`

                const [libraryResponse, boardResponse] = await Promise.all([
                    fetch(libraryUrl, config),
                    fetch(boardUrl, config),
                ])
                const libraryData = await libraryResponse.json()
                const boardData = await boardResponse.json()

                let boardsToExclude = []

                if (!libraryData.detail) {
                    for (const entry of libraryData) {
                        if (
                            entry['game_id'] === Number(gameId) &&
                            entry['wishlist'] === true
                        ) {
                            setGameInWishList(true)
                        } else if (entry['game_id'] === Number(gameId)) {
                            boardsToExclude.push(entry['board_id'])
                        }
                    }
                }

                if (boardData.detail) {
                    setBoardDataList([])
                } else {
                    const boardsToInclude = boardData.filter(
                        (board) => !boardsToExclude.includes(board.id)
                    )
                    setBoardDataList(boardsToInclude)
                }
            }
        } catch (error) {
            console.error('Error fetching data', error)
        }
    }

    const handleSubMenuClick = () => {}
    const handleDisplayClick = () => {}

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

    const handleReviewClick = (event, index, data) => {
        const v = data
        const url = `/games/${v}#create-review`;
        navigate(url, { state: 'create-review' });
    }

    const handleWishClick = async (event, index, data) => {
        const addEntryUrl = `${import.meta.env.VITE_API_HOST}/api/libraries`
        const wishListData = {}
        wishListData.wishlist = true
        wishListData.game_id = data

        const addEntryFetchConfig = {
            method: 'post',
            body: JSON.stringify(wishListData),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        try {
            const addEntryResponse = await fetch(
                addEntryUrl,
                addEntryFetchConfig
            )
            if (addEntryResponse.ok) {
                // empty
            } else {
                console.error(
                    'Failed to add to wishlist. Server response:',
                    addEntryResponse
                )
                throw new Error('Failed to add to wishlist')
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error)
        }
        setShow(false)
    }

    const handleBoardClick = async (event, index, data) => {
        const stuff = {}
        const libraryUrl = `${import.meta.env.VITE_API_HOST}/api/libraries`
        const board = data[0]
        stuff.wishlist = false
        stuff.game_id = data[1]
        stuff.board_id = board

        const fetchConfig = {
            method: 'post',
            body: JSON.stringify(stuff),
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
            },
        }
        const response = await fetch(libraryUrl, fetchConfig)
        if (response.ok) {
            setShow(false)
        }
    }

    const handleNewBoard = () => {
        navigate('/boards/create')
    }

    if (token) {
        return (
            <div className="agcard-container">
                {games.map((gameData) => (
                    <div key={gameData.id} className="agcard">
                        <Link to={`/games/${gameData.id}`}>
                            <img
                                src={gameData.background_img}
                                className="agcard-img"
                                alt={`Card for ${gameData.name}`}
                            />
                            <div className="agcontent-head">
                                <h2>
                                    {gameData.name.length > 20
                                        ? `${gameData.name.slice(0, 20)}..`
                                        : gameData.name}
                                </h2>
                            </div>
                        </Link>
                        <div className="agcontent-capsules">
                            {gameData.xbox && (
                                <img
                                    src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 1"
                                    onClick={() =>
                                        handleClick('Xbox', gameData.rawg_pk)
                                    }
                                />
                            )}

                            {gameData.playstation && (
                                <img
                                    src="https://banner2.cleanpng.com/20180710/xsc/aawqt4puu.webp"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 2"
                                    onClick={() =>
                                        handleClick(
                                            'PlayStation',
                                            gameData.rawg_pk
                                        )
                                    }
                                />
                            )}

                            {gameData.nintendo && (
                                <img
                                    src="https://i.postimg.cc/R0qXLppc/image-3.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 3"
                                    onClick={() =>
                                        handleClick(
                                            'Nintendo',
                                            gameData.rawg_pk
                                        )
                                    }
                                />
                            )}
                            {gameData.pc && (
                                <img
                                    src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 4"
                                    onClick={() =>
                                        handleClick('PC', gameData.rawg_pk)
                                    }
                                />
                            )}
                        </div>
                        <div className="agcontent-body">
                            <small style={{ color: 'white' }}>
                                {parse(gameData.description.slice(0, 200))}
                            </small>
                        </div>
                        <div className="agbutton">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    handleOptionsClick(gameData.id)
                                    setShow(!show)
                                    setPosition({ x: e.clientX - 10 })
                                    setId(gameData.id)
                                }}
                            >
                                <b>Options</b>
                            </button>
                            <div ref={menuRef} className="menu-wrapper">
                                {show && id === gameData.id && (
                                    <img
                                        src={sparkles}
                                        alt=""
                                        style={{
                                            width: '70px',
                                            position: 'absolute',
                                            left: position.x - 35,
                                            top: position.y,
                                            transform: 'translateY(85px)',
                                        }}
                                    />
                                )}
                                <Menu
                                    centerX={position.x}
                                    centerY={position.y}
                                    innerRadius={50}
                                    outerRadius={120}
                                    show={show && id === gameData.id}
                                    animation={['rotate']}
                                    animationTimeout={200}
                                    animateSubMenuChange={false}
                                >
                                    {[
                                        <MenuItem
                                            key="review"
                                            onItemClick={handleReviewClick}
                                            data={gameData.id}
                                        >
                                            Review
                                        </MenuItem>,
                                        !gameInWishList && (
                                            <MenuItem
                                                key="wish"
                                                onItemClick={handleWishClick}
                                                data={gameData.id}
                                            >
                                                Wish
                                            </MenuItem>
                                        ),
                                        boardDataList.length > 0 ? (
                                            <SubMenu
                                                key="submenu"
                                                onDisplayClick={
                                                    handleDisplayClick
                                                }
                                                onItemClick={handleSubMenuClick}
                                                itemView="Add to Board"
                                                data="2. Sub Menu"
                                                displayPosition="bottom"
                                            >
                                                {boardDataList.map((board) => (
                                                    <MenuItem
                                                        key={board.id}
                                                        onItemClick={
                                                            handleBoardClick
                                                        }
                                                        data={[
                                                            board.id,
                                                            gameData.id,
                                                        ]}
                                                    >
                                                        {board.board_name}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem
                                                    key="create-new"
                                                    onItemClick={handleNewBoard}
                                                >
                                                    Create New
                                                </MenuItem>
                                            </SubMenu>
                                        ) : (
                                            <MenuItem
                                                key="create-board"
                                                onItemClick={handleNewBoard}
                                            >
                                                Create Board
                                            </MenuItem>
                                        ),
                                    ].filter(Boolean)}
                                </Menu>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )
    } else {
        return (
            <div className="agcard-container">
                {games.map((gameData) => (
                    <div key={gameData.id} className="agcard">
                        <Link to={`/games/${gameData.id}`}>
                            <img
                                src={gameData.background_img}
                                className="agcard-img"
                                alt={`Card for ${gameData.name}`}
                            />
                            <div className="agcontent-head">
                                <h2>
                                    {gameData.name.length > 20
                                        ? `${gameData.name.slice(0, 20)}..`
                                        : gameData.name}
                                </h2>
                            </div>
                        </Link>
                        <div className="agcontent-capsules">
                            {gameData.xbox && (
                                <img
                                    src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 1"
                                    onClick={() =>
                                        handleClick('Xbox', gameData.rawg_pk)
                                    }
                                />
                            )}

                            {gameData.playstation && (
                                <img
                                    src="https://banner2.cleanpng.com/20180710/xsc/aawqt4puu.webp"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 2"
                                    onClick={() =>
                                        handleClick(
                                            'PlayStation',
                                            gameData.rawg_pk
                                        )
                                    }
                                />
                            )}

                            {gameData.nintendo && (
                                <img
                                    src="https://i.postimg.cc/R0qXLppc/image-3.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 3"
                                    onClick={() =>
                                        handleClick(
                                            'Nintendo',
                                            gameData.rawg_pk
                                        )
                                    }
                                />
                            )}
                            {gameData.pc && (
                                <img
                                    src="https://i.postimg.cc/BnPmRt60/Daco-2328688.png"
                                    width="15px"
                                    height="15px"
                                    alt="Icon 4"
                                    onClick={() =>
                                        handleClick('PC', gameData.rawg_pk)
                                    }
                                />
                            )}
                        </div>
                        <div className="agcontent-body">
                            <div style={{ color: 'white' }}>
                                {parse(gameData.description.slice(0, 200))}
                            </div>
                        </div>
                        <div className="agbutton">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/games/${gameData.id}/nonuser`)
                                }}
                            >
                                <b>Options</b>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
}

export default AllGameCard
