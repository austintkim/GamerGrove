import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Nav.css';
import logo from '../../assets/logo.gif';
import PacmanLoader from 'react-spinners/PacmanLoader';
import Icon from '../Icon/icon.jsx';

const Nav = ({
	userCookie0,
	userCookie,
	userCookie1,
	userCookie2,
	userCookie3,
	userCookie4,
	userData0,
	userData,
	userData1,
	userData2,
	userData3,
	userData4,
	userLogOut0,
	userLogOut1,
}) => {
	const [showDropdown, setShowDropdown] = useState(false);
	const avatarContainerRef = useRef(null);
	const navigate = useNavigate();
	const [searching, setSearching] = useState(false);

	const closeDropdown = (e) => {
		if (
			avatarContainerRef.current &&
			!avatarContainerRef.current.contains(e.target)
		) {
			setShowDropdown(false);
		}
	};

	const stopPropagation = (e) => {
		e.stopPropagation();
	};

	const [searchTerms, setSearchTerms] = useState('');
	const handleSearchChange = (e) => {
		let text = e.target.value;
		let result = text.replaceAll(' ', '+');
		setSearchTerms(result);
	};

	const searchGames = async (event) => {
		event.preventDefault();
		setSearching(!searching);
		const searchResults = [];
		const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
		const searchUrl = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${searchTerms}&page=1&page_size=5`;
		const gamesUrl = `${import.meta.env.VITE_API_HOST}/api/games`;

		const answer = await fetch(gamesUrl);
		if (answer.ok) {
			const answerData = await answer.json();
			const ourGames = [];
			for (const game of answerData.games) {
				ourGames.push(game.rawg_pk);
			}
			const response = await fetch(searchUrl);

			if (response.ok) {
				const data = await response.json();
				const rawg_games = data.results;
				for (const game of rawg_games) {
					searchResults.push(game.id);
					if (game.id in ourGames) {
						continue;
					} else {
						const gameData = {};
						const gameDetailUrl = `https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`;
						const details = await fetch(gameDetailUrl);
						if (details.ok) {
							const gameDetail = await details.json();
							const ourPlatforms = [
								'Xbox',
								'PlayStation',
								'Nintendo',
								'PC',
							];
							const platforms = [];
							for (const p of gameDetail.parent_platforms) {
								if (ourPlatforms.includes(p.platform['name'])) {
									platforms.push(p.platform['name']);
								}
							}

							gameData.name = gameDetail.name;
							gameData.description = gameDetail.description;
							gameData.rating = gameDetail.rating;
							gameData.dates = gameDetail.released;
							gameData.background_img =
								gameDetail.background_image;
							gameData.Xbox = 'False';
							gameData.PlayStation = 'False';
							gameData.Nintendo = 'False';
							gameData.PC = 'False';
							gameData.rating_count = 100;
							gameData.rating_total = 0;
							gameData.genre = gameDetail.genres[0]?.name;
							gameData.developers =
								gameDetail.developers[0]?.name;
							gameData.rawg_pk = gameDetail.id;
							gameData.reviews_count = 0;

							gameData.rating_total =
								gameData.rating * gameData.rating_count;
							if (gameData.genre === undefined) {
								gameData.genre = 'standard';
							}
							if (gameData.developers === undefined) {
								gameData.developers = 'code 007';
							}

							for (const pl of platforms) {
								if (pl === 'Xbox') {
									gameData.Xbox = 'true';
								}
								if (pl === 'PlayStation') {
									gameData.PlayStation = 'true';
								}
								if (pl === 'Nintendo') {
									gameData.Nintendo = 'true';
								}
								if (pl === 'PC') {
									gameData.PC = 'true';
								}
							}
							try {
								const fetchConfig = {
									method: 'post',
									body: JSON.stringify(gameData),
									headers: {
										'Content-Type': 'application/json',
									},
								};
								const postGames = await fetch(
									gamesUrl,
									fetchConfig
								);
								if (postGames.ok) {
									continue;
								}
							} catch (error) {
								continue;
							}
						}
					}
				}
			}

			navigate('/search', { state: searchResults });
		}
	};

	useEffect(() => {
		if (showDropdown) {
			window.addEventListener('click', closeDropdown);
		} else {
			window.removeEventListener('click', closeDropdown);
		}

		return () => {
			window.removeEventListener('click', closeDropdown);
		};
	}, [showDropdown]);

	const handleDropdownClick = () => {
		setShowDropdown(true);
	};

	const handleLogOut = async () => {
		const logOutUrl = `${import.meta.env.VITE_API_HOST}/token`;

		const fetchConfig = {
			method: 'delete',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(logOutUrl, fetchConfig);
		if (response.ok) {
			navigate('/');
			userLogOut0();
			userLogOut1();
			setShowDropdown(false);
			if (!response.ok) {
				throw new Error('Failed to log out');
			}
		}
	};

	if (
		userCookie ||
		userCookie0 ||
		userCookie1 ||
		userCookie2 ||
		userCookie3 ||
		userCookie4
	) {
		return (
			<div className="nav">
				<nav>
					<div className="nav__contents">
						<div className="ncontainer expanded">
							<form onSubmit={searchGames}>
								<input
									onChange={handleSearchChange}
									placeholder="Search for game titles..."
									className="js-search"
									type="text"
								/>
								<i className="fa fa-search"></i>
							</form>
						</div>

						<img
							className="nav__logo"
							src={logo}
							alt=""
							onClick={() => navigate('/')}
						/>

						<div
							ref={avatarContainerRef}
							className="nav__avatar-container"
							onClick={handleDropdownClick}
						>
							<Icon
								homeUserData={userData0}
								dashboardUserData={userData}
								allGamesUserData={userData1}
								gamesDetailsUserData={userData2}
								boardDetailsUserData={userData3}
								searchResultsUserData={userData4}
							/>
							{showDropdown && (
								<div
									className="nav__dropdown"
									onClick={stopPropagation}
								>
									<Link to="/dashboard">
										<div className="nav__dropdown-item, font-drop">
											Dashboard
										</div>
									</Link>
									<button
										className="nav__dropdown-item, font-drop logout-button"
										onClick={() => {
											handleLogOut();
										}}
									>
										Logout
									</button>
								</div>
							)}
						</div>
					</div>
				</nav>
				<div className="loader">
					<PacmanLoader
						color="#faff06"
						size={65}
						loading={searching}
						aria-label={'Loading Spinner'}
					/>
				</div>
			</div>
		);
	} else {
		return (
			<div className="nav">
				<nav>
					<div className="nav__contents">
						<div className="ncontainer expanded">
							<form onSubmit={searchGames}>
								<input
									onChange={handleSearchChange}
									placeholder="Search for game titles..."
									className="js-search"
									type="text"
								/>
								<i className="fa fa-search"></i>
							</form>
						</div>

						<img
							className="nav__logo"
							src={logo}
							alt=""
							onClick={() => navigate('/')}
						/>

						<div
							ref={avatarContainerRef}
							className="nav__avatar-container"
							onClick={handleDropdownClick}
						>
							<Icon />
							{showDropdown && (
								<div
									className="nav__dropdown"
									onClick={stopPropagation}
								>
									<Link to="/login">
										<div className="nav__dropdown-item, font-drop">
											Login
										</div>
									</Link>
									<Link to="/signup">
										<div className="nav__dropdown-item, font-drop">
											Sign Up
										</div>
									</Link>
								</div>
							)}
						</div>
					</div>
				</nav>
				<div className="loader">
					<PacmanLoader
						color="#faff06"
						size={115}
						loading={searching}
						aria-label={'Loading Spinner'}
					/>
				</div>
			</div>
		);
	}
};

export default Nav;
