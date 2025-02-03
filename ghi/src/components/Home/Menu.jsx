import { useEffect, useState, } from 'react';
import './Menu.css';
import { NavLink, Link } from 'react-router-dom';

const SideMenu = ({  }) => {

    const [genres, setGenres] = useState([]);
    const consoles = ['xbox', 'playstation', 'pc', 'nintendo']

    const fetchGenres = async () => {
        const url = `${import.meta.env.VITE_API_HOST}/api/games`;
        const response = await fetch(url)
        if (response.ok) {
            const gameGenres = []
            const data = await response.json()
            for (const game of data.games) {
                if (gameGenres.includes(game.genre)) {
                    continue
                } else {
                    gameGenres.push(game.genre)
                }
            }
            setGenres(gameGenres)
        }
    }

    useEffect(() => {
        fetchGenres();

}, []);

    return (
            <div className="side-menu">
                <ul>
<ul>
    <Link to="/">
        <h5 className='home' style={{ fontFamily: 'K2D' }}>Home Page</h5>
    </Link>
    <div className="small-space"></div>

    <hr className='solid' />

    <div className="small-space"></div>

    <NavLink to="/games" state={{ state: '' }} style={{ fontFamily: 'K2D' }}>All Games</NavLink>
    <div className="small-space"></div>
    <p>Consoles</p>
    <hr className='solid' />
        <ul>
            {consoles.map(console => {
                let displayConsole = '';

                if (console === 'playstation') {
                    displayConsole = console.charAt(0).toUpperCase() + console.slice(1, 4) + console.charAt(4).toUpperCase() + console.slice(5);
                } else if (console === 'pc') {
                    displayConsole = console.toUpperCase();
                } else {
                    displayConsole = console.charAt(0).toUpperCase() + console.slice(1);
                }

                return(
                    <li key={console}
                    className='linkside'
                    style={{
                        display:'block',
                        padding: 0,
                        marginBottom: '5px',
                        whiteSpace: 'nowrap',
                        backgroundColor: 'transparent'
                    }}
                    >
                    <NavLink to="/games" state = {{ state: console}}>- {displayConsole}</NavLink>
                    </li>
                )
            })}
        </ul>
</ul>

    <div className="small-space"></div>
    <p>Genres</p>
    <hr className='solid'/>
    <ul>

        {genres.map(genre => {
            return(
                <li key={genre}
                className='linkside'
                style={{
                    display: 'block',
                    padding: 0,
                    marginBottom: '5px',
                    whiteSpace: 'nowrap',
                    backgroundColor: 'transparent'
                }}
                >
                <NavLink to="/games" state={{ state: genre }} >- {genre}</NavLink></li>
            )

        })}

    </ul>
    <br />
    <br />
    <div className="small-space"></div>
    <hr className='solid' />

    <hr className='solid'/>
    <ul>

    </ul>
</ul>
</div>
    );
};

export default SideMenu;
