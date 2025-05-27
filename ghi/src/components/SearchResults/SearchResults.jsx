import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import Nav from '../Home/Nav.jsx'
import SideMenu from '../Home/sideMenu.jsx'
import parse from 'html-react-parser'
import { Menu, MenuItem, SubMenu } from '@spaceymonk/react-radial-menu'
import './SearchResults.css'
import sparkles from '../../assets/sparkles.gif'

const SearchResults = () => {
    const location = useLocation()
    const rawg_pks = location.state
    const [searchGames, setSearchGames] = useState([])
    const navigate = useNavigate()

    const [userToken4, setUserToken4] = useState(null)
    const [userDataDetails4, setUserDataDetails4] = useState('')

    const [id, setId] = useState('')
    const [show, setShow] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Get all elements in the click path (works for SVG)
            const path = event.composedPath()

            // Check if click is inside either:
            // 1. Your menuRef container
            // 2. Any radial menu element (including SVG components)
            const shouldStayOpen = path.some((el) => {
                // Check against menuRef
                if (menuRef.current && el === menuRef.current) return true

                // Check for radial menu elements by their unique attributes
                if (el.tagName === 'foreignObject') return true
                if (el.getAttribute?.('data-radial-menu')) return true

                // Add any other identifiers from your debug output
                return false
            })

            if (!shouldStayOpen) {
                setShow(false)
            }
        }

        if (show) {
            // Use capture phase to catch events before they bubble
            document.addEventListener('mousedown', handleClickOutside, true)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside, true)
        }
    }, [show])

    const [boardDataList, setBoardDataList] = useState([])
    const [gameInWishList, setGameInWishList] = useState(null)

    const handleOptionsClick = async (gameId) => {
        setGameInWishList(false)

        const config = {
            credentials: 'include',
        }

        const libraryUrl = `${
            import.meta.env.VITE_API_HOST
        }/api/users/libraries/${userDataDetails4.id}`
        const boardUrl = `${import.meta.env.VITE_API_HOST}/api/boards/users/${
            userDataDetails4.id
        }`

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

    const handleSubMenuClick = (e) => {
        e.stopPropagation()
    }
    const handleDisplayClick = (e) => {
        e.stopPropagation()
    }

    const fetchUserData = async () => {
        const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`

        const fetchConfig = {
            credentials: 'include',
        }

        const response = await fetch(tokenUrl, fetchConfig)
        const data = await response.json()
        if (data) {
            setUserToken4(data.access_token)
            setUserDataDetails4(data.account)
            return data.account
        } else {
            console.log('No active token!')
        }
    }

    useEffect(() => {
        fetchUserData()
        fetchGameData()
    }, [])

    const fetchGameData = async () => {
        try {
            const games = []
            const response = await fetch(
                `${import.meta.env.VITE_API_HOST}/api/games`
            )
            const data = await response.json()
            for (const d of data.games) {
                if (rawg_pks.includes(d.rawg_pk)) {
                    games.push(d)
                }
            }
            setSearchGames(games)
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    }

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
        const url = `/games/${v}#create-review`
        navigate(url, { state: 'create-review' })
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
                //empty
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

    if (userToken4) {
        return (
            <div>
                <Nav userCookie4={userToken4} userData4={userDataDetails4} />
                <SideMenu />
                <div>
                    <div>
                        <div className="sallgamesbody">
                            {searchGames.map((gameData) => (
                                <div key={gameData.id} className="shgcard">
                                    <Link to={`/games/${gameData.id}`}>
                                        <img
                                            src={gameData.background_img}
                                            className="shgcard-img"
                                            alt={`Card for ${gameData.name}`}
                                        />
                                        <div className="shgcontent-head">
                                            <h2>
                                                {gameData.name.length > 20
                                                    ? `${gameData.name.slice(
                                                          0,
                                                          20
                                                      )}..`
                                                    : gameData.name}
                                            </h2>
                                        </div>
                                    </Link>
                                    <div className="shgcontent-capsules">
                                        {gameData.xbox && (
                                            <img
                                                src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                                width="15px"
                                                height="15px"
                                                alt="Icon 1"
                                                onClick={() =>
                                                    handleClick(
                                                        'Xbox',
                                                        gameData.rawg_pk
                                                    )
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
                                                    handleClick(
                                                        'PC',
                                                        gameData.rawg_pk
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="shgcontent-body">
                                        <div>
                                            {parse(
                                                gameData.description.slice(
                                                    0,
                                                    100
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="agcontent-body">
                                        <small style={{ color: 'white' }}>
                                            {parse(
                                                gameData.description.slice(
                                                    0,
                                                    200
                                                )
                                            )}
                                        </small>
                                    </div>
                                    <div className="agbutton">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                handleOptionsClick(gameData.id)
                                                setShow(!show)
                                                setPosition({
                                                    x: e.clientX - 10,
                                                })
                                                setId(gameData.id)
                                            }}
                                        >
                                            <b>Options</b>
                                        </button>
                                        <div
                                            ref={menuRef}
                                            className="menu-wrapper"
                                        >
                                            {show && id === gameData.id && (
                                                <img
                                                    src={sparkles}
                                                    alt=""
                                                    style={{
                                                        width: '70px',
                                                        position: 'absolute',
                                                        left: position.x - 35,
                                                        top: position.y,
                                                        transform:
                                                            'translateY(85px)',
                                                    }}
                                                />
                                            )}
                                            <Menu
                                                centerX={position.x}
                                                centerY={position.y}
                                                innerRadius={50}
                                                outerRadius={120}
                                                show={
                                                    show && id === gameData.id
                                                }
                                                animation={['rotate']}
                                                animationTimeout={200}
                                                animateSubMenuChange={false}
                                            >
                                                {[
                                                    <MenuItem
                                                        key="review"
                                                        onItemClick={
                                                            handleReviewClick
                                                        }
                                                        data={gameData.id}
                                                    >
                                                        Review
                                                    </MenuItem>,
                                                    !gameInWishList && (
                                                        <MenuItem
                                                            key="wish"
                                                            onItemClick={
                                                                handleWishClick
                                                            }
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
                                                            onItemClick={
                                                                handleSubMenuClick
                                                            }
                                                            itemView="Add to Board"
                                                            data="2. Sub Menu"
                                                            displayPosition="bottom"
                                                        >
                                                            {boardDataList.map(
                                                                (board) => (
                                                                    <MenuItem
                                                                        key={
                                                                            board.id
                                                                        }
                                                                        onItemClick={
                                                                            handleBoardClick
                                                                        }
                                                                        data={[
                                                                            board.id,
                                                                            gameData.id,
                                                                        ]}
                                                                    >
                                                                        {
                                                                            board.board_name
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                            <MenuItem
                                                                key="create-new"
                                                                onItemClick={
                                                                    handleNewBoard
                                                                }
                                                            >
                                                                Create New
                                                            </MenuItem>
                                                        </SubMenu>
                                                    ) : (
                                                        <MenuItem
                                                            key="create-board"
                                                            onItemClick={
                                                                handleNewBoard
                                                            }
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
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Nav />
                <SideMenu />
                <div>
                    <div>
                        <div className="sallgamesbody">
                            {searchGames.map((gameData) => (
                                <div key={gameData.id} className="shgcard">
                                    <Link to={`/games/${gameData.id}`}>
                                        <img
                                            src={gameData.background_img}
                                            className="shgcard-img"
                                            alt={`Card for ${gameData.name}`}
                                        />
                                        <div className="shgcontent-head">
                                            <h2>
                                                {gameData.name.length > 20
                                                    ? `${gameData.name.slice(
                                                          0,
                                                          20
                                                      )}..`
                                                    : gameData.name}
                                            </h2>
                                        </div>
                                    </Link>
                                    <div className="shgcontent-capsules">
                                        {gameData.xbox && (
                                            <img
                                                src="https://i.postimg.cc/nrDT7szB/image-5.png"
                                                width="15px"
                                                height="15px"
                                                alt="Icon 1"
                                                onClick={() =>
                                                    handleClick(
                                                        'Xbox',
                                                        gameData.rawg_pk
                                                    )
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
                                                    handleClick(
                                                        'PC',
                                                        gameData.rawg_pk
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                    <div className="shgcontent-body">
                                        <div>
                                            {parse(
                                                gameData.description.slice(
                                                    0,
                                                    100
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="shgbutton">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault()
                                                navigate(
                                                    `/games/${gameData.id}/nonuser`
                                                )
                                            }}
                                        >
                                            <b>Options</b>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default SearchResults
