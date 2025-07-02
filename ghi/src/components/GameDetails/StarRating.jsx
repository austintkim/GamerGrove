const StarRating = ({ rating, onStarClick }) => {
	const stars = [1, 2, 3, 4, 5];

	return (
		<div>
			{stars.map((star) => (
				<span
					key={star}
					onClick={() => onStarClick(star)}
					style={{
						cursor: 'pointer',
						color: star <= rating ? 'gold' : 'gray',
						fontSize: '24px',
					}}
				>
					&#9733;
				</span>
			))}
		</div>
	);
};

export default StarRating;
