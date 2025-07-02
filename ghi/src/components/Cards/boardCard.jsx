import './boardCard.css';
import { Link, useNavigate } from 'react-router-dom';

function BoardCard({ boards }) {
	const navigate = useNavigate();

	if (boards.length === 0) {
		return (
			<>
				<p style={{ color: 'white' }}>No boards created.</p>
				<div>
					<button
						onClick={() => {
							navigate('/boards/create');
						}}
					>
						{' '}
						Create a board{' '}
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<div>
				<br />
				<button
					onClick={() => {
						navigate('/boards/create');
					}}
					style={{ marginLeft: '840px' }}
				>
					{' '}
					Create a board{' '}
				</button>
			</div>
			<div className="bcard-container">
				{boards.map((board) => (
					<div
						key={board.id}
						className="card"
						style={{ width: '20rem' }}
					>
						<img
							src={board.cover_photo}
							className="card-img-top"
							alt={`Board Cover for ${board.board_name}`}
							style={{ borderRadius: '20px 20px 0 0 ' }}
						/>
						<div className="card-body">
							<Link
								to={`/boards/${board.id}`}
								className="board-link"
							>
								<h5 className="card-title1">
									{board.board_name}
								</h5>
							</Link>
							<hr className="bsolid" />
							<p className="card-text1">{`${board.game_count} Games`}</p>
							<div
								className={`flex-container ${board.alignment}`}
							>
								{[...Array(3)].map((_, index) => {
									const game =
										board.games && board.games[index];
									const key = `${game ? game.game_id : 'empty'}-${board.id}-${index}`;
									const backgroundImage = game
										? game.background_img
										: 'https://i.postimg.cc/mkwt0Hbr/black-370118-1280.png';

									return (
										<div
											key={key}
											className={`flex-container ${index === 0 ? 'left' : index === 1 ? 'right' : 'center'}`}
										>
											<div
												style={{
													borderRadius: '25px',
													overflow: 'hidden',
													boxShadow:
														'0px 10px 10px black',
													backgroundColor: game
														? 'transparent'
														: 'black',
												}}
											>
												<img
													src={backgroundImage}
													className="small-card-img-top"
													alt={`Game ${index + 2}`}
												/>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default BoardCard;
