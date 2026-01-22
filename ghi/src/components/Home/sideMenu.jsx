import { useEffect, useState } from 'react';
import './sideMenu.css';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types;';

const SideMenu = ({ genres: propGenres }) => {
	const [genres, setGenres] = useState(propGenres || []);
	const [genresLoaded, setGenresLoaded] = useState(!!propGenres);
	const consoles = ['xbox', 'playstation', 'pc', 'nintendo'];

	useEffect(() => {
		if (!propGenres) {
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

			fetchGenres();
		}
	}, [propGenres]);

	if (!genresLoaded) {
		return <div>Loading menu...</div>;
	}

	return (
		<div className="side-menu">
			<ul>
				<Link to="/">
					<h5 className="home" style={{ fontFamily: 'K2D' }}>
						Home Page
					</h5>
				</Link>
				<div className="small-space"></div>
				<hr className="solid" />
				<div className="small-space"></div>
				<NavLink
					to="/games"
					state={{ state: '' }}
					style={{ fontFamily: 'K2D' }}
				>
					All Games
				</NavLink>
				<div className="small-space"></div>
				<p>Consoles</p>
				<hr className="solid" />
				<ul>
					{consoles.map((console) => {
						let displayConsole =
							console === 'pc'
								? console.toUpperCase()
								: console.charAt(0).toUpperCase() +
								  console.slice(1);

						return (
							<li key={console} className="linkside">
								<NavLink to="/games" state={{ state: console }}>
									- {displayConsole}
								</NavLink>
							</li>
						);
					})}
				</ul>
				<div className="small-space"></div>
				<p>Genres</p>
				<hr className="solid" />
				<ul>
					{genres.map((genre) => (
						<li key={genre} className="linkside">
							<NavLink to="/games" state={{ state: genre }}>
								- {genre}
							</NavLink>
						</li>
					))}
				</ul>
			</ul>
		</div>
	);
};

SideMenu.propTypes = {
	genres: PropTypes.arrayOf(PropTypes.string),
};

export default SideMenu;
