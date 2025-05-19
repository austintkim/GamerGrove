import { useState, useEffect } from 'react';
import Landing from './components/Home/Landing';
import Nav from './components/Home/Nav';
import Rows from './components/Home/Rows';
import SideMenu from './components/Home/sideMenu';
import bm from './assets/bm.gif';

function Home() {
    const [userToken0, setUserToken0] = useState(null);
    const [userDataDetails0, setUserDataDetails0] = useState('');
    const [genres, setGenres] = useState([]);
    const [genresLoaded, setGenresLoaded] = useState(false);
    const [carouselGames, setCarouselGames] = useState([]);
    const [carouselGamesLoaded, setCarouselGamesLoaded] = useState(false);
    const [games, setGames] = useState([]);
    const [gamesLoaded, setGamesLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 250);

        return () => clearTimeout(timeout);
    }, []);

    const fetchUserData = async () => {
        const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
        const fetchConfig = { credentials: 'include' };

        try {
            const response = await fetch(tokenUrl, fetchConfig);
            const data = await response.json();
            if (data) {
                setUserToken0(data.access_token);
                setUserDataDetails0(data.account);
            } else {
                console.log('No active token!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchGenres = async () => {
        try {
            const url = `${import.meta.env.VITE_API_HOST}/api/games`;
            const response = await fetch(url);

            if (response.ok) {
                const gameGenres = [];
                const data = await response.json();

                for (const game of data.games) {
                    if (!gameGenres.includes(game.genre)) {
                        gameGenres.push(game.genre);
                    }
                }

                setGenres(gameGenres);
                setGenresLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching genres:', error);
            setGenresLoaded(true);
        }
    };

   const preloadGameData = (games) => {
    return Promise.all(
        games.map((game) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = game.background_img;
                img.onload = () => resolve({
                    name: game.name,
                    xbox: game.xbox,
                    playstation: game.playstation,
                    nintendo: game.nintendo,
                    background_img: game.background_img
                });
                img.onerror = () => resolve({
                    name: game.name,
                    xbox: game.xbox,
                    playstation: game.playstation,
                    nintendo: game.nintendo,
                    background_img: null
                });
            });
        })
    );
};

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games`);
                const data = await response.json();

                await preloadGameData(data.games);
                setGames(data.games);
                setGamesLoaded(true);

                const filteredGames = data.games.filter(game => game.rating > 4.35);

                setCarouselGames(filteredGames);
                setCarouselGamesLoaded(true);
            } catch (error) {
                console.error('Error fetching games', error);
                setGamesLoaded(true);
                setCarouselGamesLoaded(true);
            }
        };

        fetchUserData();
        fetchGenres();
        fetchGames();
    }, []);

    const homeLogOut = () => {
        setUserToken0(null);
        setUserDataDetails0('');
    };

    if (!genresLoaded || !carouselGamesLoaded || !gamesLoaded) {
        if (showLoader) {
            return (
                <img
                    src={bm}
                    alt=""
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "350px",
                        objectFit: "contain",
                        cursor: "pointer",
                        padding: "16px",
                        zIndex: 3
                    }}
                />
            );
        }
        return null;
    }



    return (
        <div>
            <Nav
                userCookie0={userToken0}
                userData0={userDataDetails0}
                userLogOut0={homeLogOut}
            />
            <SideMenu genres={genres} />
            <Landing carouselGames={carouselGames} />
            <Rows
                path="/"
                element={<Rows />}
                userCookie0={userToken0}
                userData0={userDataDetails0}
                games={games}
            />
        </div>
    )
}

export default Home;
