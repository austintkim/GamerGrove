import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './screenshotsCard.css';

function ScreenshotsCard({ rawgPk }) {
	const [screenshots, setScreenshots] = useState([]);

	useEffect(() => {
		const fetchScreenshots = async () => {
			try {
				const response = await fetch(
					`${import.meta.env.VITE_API_HOST}/api/screenshots/${rawgPk}`
				);
				const data = await response.json();
				setScreenshots(Array.isArray(data) ? data.slice(0, 3) : []);
			} catch (error) {
				//empty
			}
		};

		if (rawgPk) {
			fetchScreenshots();
		}
	}, [rawgPk]);

	return (
		<div className="screenshotscard">
			<div className="scard-content">
				{screenshots.map((screenshot, index) => (
					<div
						key={index}
						className={`scard-${
							index === 0
								? 'Herophoto'
								: `Smallphoto${index === 1 ? 'Top' : 'Bottom'}`
						}`}
					>
						<img
							src={screenshot.image_url}
							alt={`Screenshot ${index + 1}`}
						/>
					</div>
				))}
			</div>
			<div className="scard-title">Screenshots</div>
			<hr className="ssolid" />
		</div>
	);
}

ScreenshotsCard.propTypes = {
	rawgPk: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		.isRequired,
};

ScreenshotsCard.defaultProps = {
	rawgPk: null,
};

export default ScreenshotsCard;
