import {useAuthContext} from "@galvanize-inc/jwtdown-for-react";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Nav from '../Home/Nav.jsx';
import SideMenu from '../Home/Menu.jsx';
import parse from 'html-react-parser';
import { Menu, MenuItem, SubMenu } from "@spaceymonk/react-radial-menu";
import './SearchResults.css';

const SearchResults = () => {
    const location = useLocation();
    const rawg_pks = location.state
    const [searchGames, setSearchGames] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuthContext();
    const [id, setId] = useState('');
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    async function fetchUserName() {
    const tokenUrl = `http://localhost:8000/token`;
    const fetchConfig = {
        credentials: 'include',
        redirect: 'follow',
    };

    const response = await fetch(tokenUrl, fetchConfig);

    if (response.ok) {
        const data = await response.json();
        if (data!== null){
          return data.account.id;
        }
    }
    }

    const [boardDataList, setBoardDataList] = useState([]);

    const handleDisplayClick = (event, position) => {

  };

    const handleSubMenuClick = (event, index, data) => {

    };

    const fetchBoardData = async (userId) => {
        const boardUrl = `http://localhost:8000/api/boards/users/${userId}`;
        const boardConfig = {
        credentials: 'include',
        };

        try {
        const response = await fetch(boardUrl, boardConfig);
        const boardData = await response.json();

        if (boardData.detail) {
          return [];
        }

        const boards = []
        for (const b of boardData) {
            boards.push(b)
        }
        setBoardDataList(boards);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };



    const fetchData = async () => {
        try {
        const games = []
        const response = await fetch('http://localhost:8000/api/games');
        const data = await response.json();
        for (const d of data) {
            if (rawg_pks.includes(d.rawg_pk)) {
                games.push(d)
            }
        }
        setSearchGames(games)
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };


useEffect(() => {
    fetchData();
    const fetchUserData = async () => {
      const userId = await fetchUserName();
      if (userId !== undefined){
        fetchBoardData(userId);
      }
    }
    fetchUserData();
  }, []);


  const handleClick = async (platform, rawg_pk) => {
    const storeUrl = await fetchStoreUrl(platform, rawg_pk);
    if (storeUrl) {
      window.location.href = storeUrl;
    }
  };

  const fetchStoreUrl = async (platform, rawg_pk) => {
    try {

      const response = await fetch(`http://localhost:8000/api/stores/${rawg_pk}`);

      const data = await response.json();


      for (const link of data) {
        if (link.platform === platform) {
          return link.url
        }

      }




    } catch (error) {
      console.error('Cant find the store you are looking for', error);
      return null;
    }
  };

    const handleReviewClick = (event, index, data) => {
        const v = data;
        navigate(`/games/${v}`, { state: 'create-review'})
    }



    const handleDetailClick = (event, index, data) => {
        const v = data;
        navigate(`/games/${v}`)

    }

    const handleWishClick = async (event, index, data) => {

        const addEntryUrl = 'http://localhost:8000/api/libraries';
        const wishListData = {}
        wishListData.wishlist = true;
        wishListData.game_id = data;

        const addEntryFetchConfig = {
        method: "post",
        body: JSON.stringify(wishListData),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
        };

        try {
        const addEntryResponse = await fetch(addEntryUrl, addEntryFetchConfig);
        if (addEntryResponse.ok) {
        } else {
            console.error('Failed to add to wishlist. Server response:', response);
            throw new Error('Failed to add to wishlist');
        }
        } catch (error) {
        console.error('Error adding to wishlist:', error);
        }
        setShow(false)

    };

    const handleBoardClick = async (event, index, data) => {
        const stuff = {};
        const libraryUrl = `http://localhost:8000/api/libraries`
        const board = data[0];
        stuff.wishlist = false;
        stuff.game_id = data[1];
        stuff.board_id = board;

        const fetchConfig = {
        method: 'post',
        body: JSON.stringify(stuff),
        credentials: 'include',
        headers: {
            "Content-type": "application/json"
        }
        }
        const response = await fetch(libraryUrl, fetchConfig);
        setShow(false)
    }

    const handleNewBoard = (event, index, data) => {
        navigate("/boards/create")
    }


    if (token) {
        return (
          <div>
             <Nav />
             <SideMenu />
            <div>
              <div>


                <div className='sallgamesbody'>
                {searchGames.map((gameData) => (
                    <div key={gameData.id} className='shgcard'>
                    <Link to={`/games/${gameData.id}`}>
                        <img
                        src={gameData.background_img}
                        className="shgcard-img"
                        alt={`Card for ${gameData.name}`}
                        />
                        <div className="shgcontent-head">
                        <h2>
                            {gameData.name.length > 20
                            ? `${gameData.name.slice(0, 20)}..`
                            : gameData.name
                            }
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
                            onClick={() => handleClick('Xbox', gameData.rawg_pk)}
                        />
                        )}

                        {gameData.playstation && (
                            <img
                            src="https://cdn.icon-icons.com/icons2/2429/PNG/512/playstation_logo_icon_147249.png"
                            width="15px"
                            height="15px"
                            alt="Icon 2"
                            onClick={() => handleClick('PlayStation', gameData.rawg_pk)}
                        />
                        )}


                        {gameData.nintendo && (
                            <img
                                src="https://i.postimg.cc/R0qXLppc/image-3.png"
                                width="15px"
                                height="15px"
                                alt="Icon 3"
                                onClick={() => handleClick('Nintendo', gameData.rawg_pk)}
                            />
                            )}
                            {gameData.pc && (
                            <img
                                src="https://imgtr.ee/images/2024/01/29/85a2afdfc48ffb6bf795b565eba3de63.png"
                                width="15px"
                                height="15px"
                                alt="Icon 4"
                                onClick={() => handleClick('PC', gameData.rawg_pk)}
                            />
                            )}

                    </div>
                    <div className="shgcontent-body">
                        <div>{parse(gameData.description.slice(0, 100))}</div>
                    </div>
                    <div className="shgbutton">
                        <button onClick={(e) => {
                            e.preventDefault();
                            setShow(!show);
                            setPosition({ x: e.clientX-10 });
                            setId(gameData.id)
                            }}

                            >
                        <b>Options</b>
                        </button>
                        <div className="menu-wrapper"

                        >
                            <Menu

                            centerX={position.x}
                            centerY={position.y}
                            innerRadius={50}
                            outerRadius={120}
                            show={show && id===gameData.id}
                            animation={["rotate"]}
                            animationTimeout={200}
                            animateSubMenuChange={false}
                            >

                            <MenuItem className='menuitem' onItemClick={handleReviewClick} data={gameData.id}>
                                Review
                            </MenuItem>
                            <MenuItem onItemClick={handleWishClick} data={gameData.id}>
                                Wish
                            </MenuItem>
                            <MenuItem onItemClick={handleDetailClick} data={gameData.id} >
                                Details
                            </MenuItem>
                            {boardDataList.length > 0 ?
                            <SubMenu
                                onDisplayClick={handleDisplayClick}
                                onItemClick={handleSubMenuClick}
                                itemView="Add to Board"
                                data="2. Sub Menu"
                                displayPosition="bottom"
                            >
                                {boardDataList.map(board => {
                                return(
                                    <MenuItem onItemClick={handleBoardClick} key={board.id} data={[board.id, gameData.id]}>
                                    {board.board_name}
                                    </MenuItem>
                                )
                                })}
                                <MenuItem onItemClick={handleNewBoard}>Create New</MenuItem>




                            </SubMenu>
                            :
                            <MenuItem onItemClick={handleNewBoard}>Create Board</MenuItem>
                            }
                            </Menu>
                        </div>


                    </div>
                    </div>
                ))}
                </div>
                </div>
              </div>
            </div>
            );

    } else {
  return (
    <div>
      <Nav />
      <SideMenu />
      <div >

        <div >
          <div className='sallgamesbody'>
            {searchGames.map((gameData) => (
              <div key={gameData.id} className='shgcard'>
                <Link to={`/games/${gameData.id}`}>
                  <img
                    src={gameData.background_img}
                    className="shgcard-img"
                    alt={`Card for ${gameData.name}`}
                  />
                  <div className="shgcontent-head">
                    <h2>
                      {gameData.name.length > 20
                        ? `${gameData.name.slice(0, 20)}..`
                        : gameData.name
                      }
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
                      onClick={() => handleClick('Xbox', gameData.rawg_pk)}
                    />
                  )}
                  {gameData.playstation && (
                    <img
                      src="https://cdn.icon-icons.com/icons2/2429/PNG/512/playstation_logo_icon_147249.png"
                      width="15px"
                      height="15px"
                      alt="Icon 2"
                      onClick={() => handleClick('PlayStation', gameData.rawg_pk)}
                    />
                  )}
                  {gameData.nintendo && (
                    <img
                      src="https://i.postimg.cc/R0qXLppc/image-3.png"
                      width="15px"
                      height="15px"
                      alt="Icon 3"
                      onClick={() => handleClick('Nintendo', gameData.rawg_pk)}
                    />
                  )}
                  {gameData.pc && (
                    <img
                      src="https://imgtr.ee/images/2024/01/29/85a2afdfc48ffb6bf795b565eba3de63.png"
                      width="15px"
                      height="15px"
                      alt="Icon 4"
                      onClick={() => handleClick('PC', gameData.rawg_pk)}
                    />
                  )}
                </div>
                <div className="shgcontent-body">
                  <div>{parse(gameData.description.slice(0, 100))}</div>
                </div>
                <div className="shgbutton">
                  <button>
                    <b>Options</b>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
}
export default SearchResults;
