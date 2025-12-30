import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import './gameCard.css';

function GameCard({ games }) {
	if (games.length === 0) {
		return (
			<>
				<p style={{ color: 'white' }}>
					No games added to a board or your wishlist.
				</p>
			</>
		);
	}

	return (
		<div className="gcard-container">
			{games.map((game) => (
				<div key={game.id} className="gcard">
					<Link to={`/games/${game.id}`}>
						<img
							src={game.background_img}
							className="gcard-img"
							alt={`Card for ${game.name}`}
						/>
						<div className="gcontent-head">
							<h2>
								{game.name.length > 17
									? `${game.name.slice(0, 17)}..`
									: game.name}
							</h2>
						</div>
					</Link>
					<br />
					<div className="gcontent-body">
						{game.description.length > 200 && (
							<div>
								{parse(`${game.description.slice(0, 200)}..`)}
							</div>
						)}
					</div>
					<div className="gbutton"></div>
				</div>
			))}
		</div>
	);
}

GameCard.propTypes = {
	games: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			description: PropTypes.string.isRequired,
			background_img: PropTypes.string,
		})
	).isRequired,
};

GameCard.defaultProps = {
	games: [],
};

export default GameCard;
