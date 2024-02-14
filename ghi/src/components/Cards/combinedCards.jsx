import UserReviewCard from './userReviewCard';
import ReviewCard from './reviewCard';

function CombinedCards() {
  const flexContainerStyle = {
    display: 'flex',
  };

  return (
    <div style={flexContainerStyle}>
      <ReviewCard />
      <UserReviewCard />
    </div>
  );
}

export default CombinedCards;
