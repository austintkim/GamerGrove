import './Rows.css';
import HomeGameCard from '../Cards/homeGameCard.jsx';

const Rows = ({ selectedGenre, games, userCookie0, userData0 }) => {
	const organizeGamesByGenre = () => {
		const organizedGames = {};
		games.forEach((game) => {
			if (!organizedGames[game.genre]) {
				organizedGames[game.genre] = [];
			}
			if (!selectedGenre || game.genre === selectedGenre) {
				organizedGames[game.genre].push(game);
			}
		});
		return organizedGames;
	};

	const organizedGamesByGenre = organizeGamesByGenre();

	return (
		<div>
			{Object.keys(organizedGamesByGenre).map((genre) => (
				<div key={genre} className="row">
					<h3>{`${genre} Games`}</h3>
					<div className="line"></div>
					<div className="row__posters">
						<HomeGameCard
							games={organizedGamesByGenre[genre].slice(0, 5)}
							userCookie0={userCookie0}
							userData0={userData0}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default Rows;
