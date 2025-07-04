import { Link } from 'react-router-dom';
import './Landing.css';
import './sideMenu';
import './Rows';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Landing = ({ carouselGames }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
	};

	return (
		<header>
			<br />
			<br />
			<h3 className="homeH3">Most Popular</h3>
			<div className="homeline"></div>
			<Slider {...settings}>
				{carouselGames.map((game, index) => (
					<div key={index}>
						<Link to={`/games/${game.id}`}>
							<img
								src={game.background_img}
								className="d-block w-100"
								alt={game.title}
								style={{
									maxHeight: '400px',
									maxWidth: '1000px',
									minHeight: '400px',
									objectFit: 'cover',
									margin: '0 auto',
									marginLeft: '355px',
									borderRadius: '40px',
									marginTop: '10px',
								}}
							/>
						</Link>
						<div className="caption-container">
							<div className="caption">
								<h5>{game.name}</h5>
							</div>
						</div>
					</div>
				))}
			</Slider>
		</header>
	);
};

export default Landing;
