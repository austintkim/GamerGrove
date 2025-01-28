import './reviewCard.css';
import { Link } from 'react-router-dom';

function ReviewCard({ games }) {

  console.log(games);

  const handleLinkClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      {games.map((gameDetails) => (
        <div key={gameDetails.id} className="rcard">
          <div className="card-content">
            <div className="card-photo">
              <img src={gameDetails?.background_img} alt="Card Photo" />
            </div>
            <div className="card-details">
              <Link to={`/games/${gameDetails.id}`} onClick={handleLinkClick}>
                <div className="card-title">{gameDetails?.name}</div>
              </Link>
              <hr className="rsolid" />
              <div className="side-by-side">
                <div className="link-container">

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReviewCard;
