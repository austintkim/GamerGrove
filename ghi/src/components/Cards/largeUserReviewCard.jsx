import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './largeUserReviewCard.css';
import StarRating from '../GameDetails/StarRating';

function LargeUserReviewCard({
	gameId,
	accountId,
	newReview,
	userVotes,
	onVote,
}) {
	const navigate = useNavigate();
	const [userReviews, setUserReviews] = useState([]);

	const fetchReviewsForGame = async (gameId, cancelVote = null) => {
		const reviewsUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/reviews/games/${gameId}`;

		try {
			const response = await fetch(reviewsUrl);

			if (response.status === 404) {
				setUserReviews([]);
			} else {
				const reviewsData = await response.json();
				if (userVotes.length > 0) {
					for (const r of reviewsData) {
						for (const v of userVotes) {
							if (r.id == v.review_id) {
								if (
									(v.upvote && cancelVote) ||
									(!v.upvote && cancelVote)
								) {
									r.upvote = undefined;
								} else if (v.upvote) {
									r.upvote = true;
								} else if (!v.upvote) {
									r.upvote = false;
								}
							}
						}
					}
				}
				const sortedReviews = reviewsData.sort(
					(a, b) => new Date(b.last_update) - new Date(a.last_update)
				);
				setUserReviews(sortedReviews);
			}
		} catch (error) {
			console.error('Error fetching reviews:', error);
		}
	};

	useEffect(() => {
		fetchReviewsForGame(gameId);
	}, [gameId, accountId, newReview, userVotes]);

	async function fetchUserName() {
		const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;
		const fetchConfig = {
			credentials: 'include',
			redirect: 'follow',
		};

		const response = await fetch(tokenUrl, fetchConfig);

		if (response.ok) {
			const data = await response.json();
			return data.account.id;
		}
	}

	const handleUpVoteClick = async (reviewId, gameId) => {
		const user = await fetchUserName();

		const upVoteData = {
			review_id: reviewId,
			upvote: true,
		};
		if (user) {
			const reviewVotesUrl = `${import.meta.env.VITE_API_HOST}/api/votes/reviews/${reviewId}`;
			const response = await fetch(reviewVotesUrl, {
				credentials: 'include',
			});

			if (response.status === 404) {
				const upVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/`;
				const upVoteConfig = {
					method: 'post',
					body: JSON.stringify(upVoteData),
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				};
				try {
					const response = await fetch(upVoteUrl, upVoteConfig);
					if (response.ok) {
						onVote();
					} else {
						throw new Error('Failed to create upvote');
					}
				} catch (error) {
					console.error('Error creating upvote');
				}
				fetchReviewsForGame(gameId);
				return;
			} else if (response.status === 500) {
				throw new Error('Error fetching review votes');
			} else if (response.ok) {
				const votes = await response.json();
				for (const v of votes) {
					if (v.account_id == user) {
						if (v.upvote == true) {
							const deleteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/${v.id}/${user}`;

							const deleteConfig = {
								method: 'delete',
								credentials: 'include',
								headers: {
									'Content-Type': 'application/json',
								},
							};

							try {
								const response = await fetch(
									deleteUrl,
									deleteConfig
								);
								if (response.ok) {
									onVote();
								} else {
									throw new Error('Failed to delete vote');
								}
							} catch (error) {
								console.error('Error deleting vote', error);
							}
							fetchReviewsForGame(gameId, true);
							return;
						} else {
							const upVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/${v.id}/${user}`;
							const upVoteConfig = {
								method: 'put',
								body: JSON.stringify(upVoteData),
								credentials: 'include',
								headers: {
									'Content-Type': 'application/json',
								},
							};
							try {
								const response = await fetch(
									upVoteUrl,
									upVoteConfig
								);
								if (response.ok) {
									onVote();
								} else {
									throw new Error(
										'Failed to update vote from downvote to upvote'
									);
								}
							} catch (error) {
								console.error('Error updating vote', error);
							}
							fetchReviewsForGame(gameId);
							return;
						}
					}
				}
				const upVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/`;
				const upVoteConfig = {
					method: 'post',
					body: JSON.stringify(upVoteData),
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				};
				try {
					const response = await fetch(upVoteUrl, upVoteConfig);
					if (response.ok) {
						onVote();
					} else {
						throw new Error('Failed to create upvote');
					}
				} catch (error) {
					console.error('Error creating upvote');
				}
				fetchReviewsForGame(gameId);
			}
		}
	};

	const handleDownVoteClick = async (reviewId, gameId) => {
		const user = await fetchUserName();
		const downVoteData = {
			review_id: reviewId,
			upvote: false,
		};
		if (user) {
			const voteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/reviews/${reviewId}`;
			const response = await fetch(voteUrl, { credentials: 'include' });
			if (response.status === 404) {
				const downVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes`;
				const downVoteConfig = {
					method: 'post',
					body: JSON.stringify(downVoteData),
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				};
				try {
					const response = await fetch(downVoteUrl, downVoteConfig);
					if (response.ok) {
						onVote();
					} else {
						throw new Error('Failed to create downvote');
					}
				} catch (error) {
					console.error('Error creating upvote');
				}
				fetchReviewsForGame(gameId);
				return;
			} else if (response.status === 500) {
				throw new Error('Error fetching review votes');
			} else if (response.ok) {
				const votes = await response.json();
				for (const v of votes) {
					if (v.account_id == user) {
						if (v.upvote == false) {
							const deleteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/${v.id}/${user}`;

							const deleteConfig = {
								method: 'delete',
								credentials: 'include',
								headers: {
									'Content-Type': 'application/json',
								},
							};

							try {
								const response = await fetch(
									deleteUrl,
									deleteConfig
								);
								if (response.ok) {
									onVote();
								} else {
									throw new Error('Failed to delete vote');
								}
							} catch (error) {
								console.error('Error deleting vote', error);
							}
							fetchReviewsForGame(gameId, true);
							return;
						} else {
							const downVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes/${v.id}/${user}`;
							const downVoteConfig = {
								method: 'put',
								body: JSON.stringify(downVoteData),
								credentials: 'include',
								headers: {
									'Content-Type': 'application/json',
								},
							};
							try {
								const response = await fetch(
									downVoteUrl,
									downVoteConfig
								);
								if (response.ok) {
									onVote();
								} else {
									throw new Error(
										'Failed to update vote from downvote to upvote'
									);
								}
							} catch (error) {
								console.error('Error updating vote', error);
							}
							fetchReviewsForGame(gameId);
							return;
						}
					}
				}
				const downVoteUrl = `${import.meta.env.VITE_API_HOST}/api/votes`;
				const downVoteConfig = {
					method: 'post',
					body: JSON.stringify(downVoteData),
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				};
				try {
					const response = await fetch(downVoteUrl, downVoteConfig);
					if (response.ok) {
						onVote();
					} else {
						throw new Error('Failed to create downvote');
					}
				} catch (error) {
					console.error('Error creating downvote');
				}
				fetchReviewsForGame(gameId);
			}
		}
	};

	return (
		<div>
			{Array.isArray(userReviews) && userReviews.length > 0 ? (
				userReviews.map((review) => (
					<div
						key={review.id}
						className="largercard"
						id={`review-${review.id}`}
					>
						<div>
							<div className="lurcard-title">{review.title}</div>
						</div>
						<div style={{ marginBottom: '10px' }}>
							{review.account_id === accountId && (
								<>
									<button
										className="lurcard-edit-delete"
										style={{ color: 'black' }}
										onClick={() => {
											navigate(
												`/reviews/update/${review.id}/${review.game_id}`
											);
										}}
									>
										Edit
									</button>{' '}
									<button
										className="lurcard-delete"
										style={{
											color: 'black',
											fontFamily: 'K2D',
											fontSize: '18px',
										}}
										onClick={() => {
											navigate(
												`/reviews/delete/${review.id}`
											);
										}}
									>
										Delete
									</button>{' '}
								</>
							)}
						</div>
						<div className="lurline"></div>
						<div
							style={{ color: 'white' }}
							className="lurcard-content"
						>
							<div className="lurcard-details">
								<p>{review.body}</p>
							</div>
							<div className="lurcard-date">
								<div className="rating-container">
									<div
										className="star-rating"
										style={{ marginTop: '75px' }}
									>
										<StarRating rating={review.rating} />
									</div>
								</div>
							</div>
						</div>
						<div className="divthumbs">
							<button
								onClick={() => {
									handleUpVoteClick(
										review.id,
										review.game_id
									);
								}}
								style={{
									backgroundColor:
										review.upvote === true
											? 'green'
											: 'transparent',
								}}
							>
								<img
									className="thumb-up"
									src="https://i.postimg.cc/dV4GtWb9/Thumbs-Up-White.png"
									alt="Thumbs Up"
								/>
								<p
									className="urp"
									style={{
										color: 'white',
										margin: '0',
										fontWeight: 'bold',
										textAlign: 'center',
									}}
								>
									{review.upvote_count}
								</p>
							</button>
							<button
								className="down-btn"
								onClick={() => {
									handleDownVoteClick(
										review.id,
										review.game_id
									);
								}}
								style={{
									backgroundColor:
										review.upvote === false
											? 'red'
											: 'transparent',
								}}
							>
								<img
									className="thumbs-down"
									src="https://i.postimg.cc/fyNVvm4L/Thumbsdown-White.png"
									alt="Thumbs Down"
								/>
							</button>
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
									)} by {review.username}
								</p>
							)}
						</div>
					</div>
				))
			) : (
				<p style={{ textAlign: 'center', marginRight: '250px' }}>
					No reviews available for this game.
				</p>
			)}
		</div>
	);
}

export default LargeUserReviewCard;
