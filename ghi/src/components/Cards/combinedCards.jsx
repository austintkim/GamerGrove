import UserReviewCard from './userReviewCard';
import ReviewCard from './reviewCard';

function CombinedCards({ reviews, reviewGames } ) {
  const flexContainerStyle = {
    display: 'flex',
  };

  const gamesMap = new Map(reviewGames.map(game => [game.id, game]));

  reviews.forEach(review => {
    const game = gamesMap.get(review.game_id);
    if (game) {
      review.background_img = game.background_img;
      review.game_name = game.name;
    }
  });

  return (
    <div style={flexContainerStyle}>
      <ReviewCard games = {reviewGames}/>
      <UserReviewCard userReviews = {reviews}/>
    </div>
  );
}

export default CombinedCards;
