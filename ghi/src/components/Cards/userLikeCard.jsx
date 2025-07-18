import './userLikeCard.css';
import StarRating from '../GameDetails/StarRating';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function UserLikeCard({ likedReviews, likedReviewGames }) {
	const navigate = useNavigate();

	const gamesMap = new Map(likedReviewGames.map((game) => [game.id, game]));

	likedReviews.forEach((review) => {
		const game = gamesMap.get(review.game_id);
		if (game) {
			review.background_img = game.background_img;
			review.game_name = game.name;
		}
	});

	const handleLikedReviewClick = (reviewId, gameId) => {
		navigate(`/games/${gameId}#review-${reviewId}`);
	};

	return (
		<div>
			{likedReviews.length === 0 ? (
				<p style={{ color: 'white' }}>No liked reviews yet.</p>
			) : (
				likedReviews.map((review) => (
					<div key={review.id} className="urcard">
						<div className="urcard-content">
							<div className="urcard-title">{review.title}</div>
						</div>
						<div className="urline"></div>
						<div className="urcard-content">
							<div
								style={{
									textAlign: 'center',
									fontFamily: 'K2D',
									color: 'white',
								}}
							>
								{review.game_name}
							</div>
							<div
								className="urcard-content"
								style={{ marginBottom: '15px' }}
							>
								<img
									src={review.background_img}
									alt="Card Photo"
									onClick={() =>
										handleLikedReviewClick(
											review.id,
											review.game_id
										)
									}
									style={{ cursor: 'pointer' }}
								/>
							</div>
							<div
								className="urline"
								style={{ marginBottom: '0px' }}
							></div>
							<div className="urcard-details">
								<div
									style={{
										textAlign: 'center',
										fontFamily: 'K2D',
									}}
								>
									{review.body}
								</div>
								{review.rating && (
									<div className="rating-container">
										<div className="star-rating">
											<StarRating
												rating={review.rating}
											/>
										</div>
									</div>
								)}
							</div>
						</div>
						{review.last_update > review.date_created ? (
							<p
								style={{
									color: 'white',
									marginRight: '10px',
									marginBottom: '10px',
									textAlign: 'right',
								}}
							>
								{' '}
								Updated{' '}
								{formatDistanceToNow(
									new Date(`${review.last_update}Z`),
									{ addSuffix: true }
								)}
							</p>
						) : (
							<p
								style={{
									color: 'white',
									marginRight: '10px',
									marginBottom: '10px',
									textAlign: 'right',
								}}
							>
								{' '}
								Posted{' '}
								{formatDistanceToNow(
									new Date(`${review.date_created}Z`),
									{ addSuffix: true }
								)}{' '}
								by {review.username}
							</p>
						)}
					</div>
				))
			)}
		</div>
	);
}
export default UserLikeCard;
