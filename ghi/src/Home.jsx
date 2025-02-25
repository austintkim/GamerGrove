import { useState, useEffect } from 'react';
import Landing from './components/Home/Landing';
import Nav from './components/Home/Nav';
import Rows from './components/Home/Rows';
import SideMenu from './components/Home/sideMenu';

function Home() {
    const [userToken0, setUserToken0] = useState(null);
    const [userDataDetails0, setUserDataDetails0] = useState('');
    const [genres, setGenres] = useState([]);
    const [genresLoaded, setGenresLoaded] = useState(false);
    const [carousel, setCarousel] = useState([]);
    const [carouselLoaded, setCarouselLoaded] = useState(false);

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

    const preloadImages = (games) => {
        return Promise.all(
            games.map((game) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.src = game.background_img;
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            })
        );
    };

    const fetchCarousel = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_HOST}/api/games`);
            const data = await response.json();
            const filteredGames = data.games.filter(game => game.rating > 4.35);

            await preloadImages(filteredGames);
            setCarousel(filteredGames);
            setCarouselLoaded(true);
        } catch (error) {
            console.error('Error fetching carousel', error);
            setCarouselLoaded(true);
        }

    }

    useEffect(() => {
        fetchUserData();
        fetchGenres();
        fetchCarousel();
    }, []);

    const homeLogOut = () => {
        setUserToken0(null);
        setUserDataDetails0('');
    };

    if (!genresLoaded || !carouselLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Nav
                userCookie0={userToken0}
                userData0={userDataDetails0}
                userLogOut0={homeLogOut}
            />
            <SideMenu genres={genres} />
            <Landing games={carousel} />
            <Rows path="/" element={<Rows />} />
        </div>
    );
}

export default Home;
