import UserReviewCard from './userReviewCard';
import ReviewCard from './reviewCard';

function CombinedCards({ reviews, reviewGames } ) {
  const flexContainerStyle = {
    display: 'flex',
  };

  return (
    <div style={flexContainerStyle}>
      <ReviewCard games = {reviewGames}/>
      <UserReviewCard userReviews = {reviews}/>
    </div>
  );
}

export default CombinedCards;
