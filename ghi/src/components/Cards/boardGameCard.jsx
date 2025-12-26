import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './boardGameCard.css';
import parse from 'html-react-parser';

function BoardGameCard({ gameData, onGameRemoval }) {
	return (
		<div className="board-game-card">
			<Link to={`/games/${gameData.id}`}>
				<img
					src={gameData.background_img}
					className="board-game-card-img"
					alt={`Card for ${gameData.name}`}
				/>
				<div className="board-game-content-head">
					<h2>{gameData.name.slice(0, 20)}</h2>
				</div>

				<br />
				<div className="board-game-content-body">
					<div>{parse(gameData.description.slice(0, 150))}</div>
				</div>
			</Link>
			<div className="board-game-button">
				<button
					onClick={() => {
						onGameRemoval(gameData.library_id, gameData.account_id);
					}}
				>
					<b>Remove Game</b>
				</button>
			</div>
		</div>
	);
}
BoardGameCard.propTypes = {
	gameData: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		background_img: PropTypes.string,
		library_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
		account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
			.isRequired,
	}).isRequired,

	onGameRemoval: PropTypes.func.isRequired,
};
BoardGameCard.defaultProps = {
	gameData: {
		background_img: '',
	},
};

export default BoardGameCard;
