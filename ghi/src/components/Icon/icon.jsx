import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Icon = ({
	homeUserData,
	dashboardUserData,
	allGamesUserData,
	gamesDetailsUserData,
	boardDetailsUserData,
	searchResultsUserData,
}) => {
	const [iconUrl, setIconUrl] = useState(null);
	const [userData, setUserData] = useState(null);

	const fetchUserIcon = async (iconID) => {
		try {
			const iconResponse = await fetch(
				`${import.meta.env.VITE_API_HOST}/api/icons/${iconID}`
			);
			const iconData = await iconResponse.json();
			setIconUrl(iconData.icon_url);
		} catch (error) {
			console.error('Error fetching icon:', error);
		}
	};

	useEffect(() => {
		setUserData(
			homeUserData ||
				dashboardUserData ||
				allGamesUserData ||
				gamesDetailsUserData ||
				boardDetailsUserData ||
				searchResultsUserData
		);
	}, [
		homeUserData,
		dashboardUserData,
		allGamesUserData,
		gamesDetailsUserData,
		boardDetailsUserData,
		searchResultsUserData,
	]);

	useEffect(() => {
		if (userData && userData.icon_id) {
			fetchUserIcon(userData.icon_id);
		} else {
			setIconUrl(null);
		}
	}, [userData]);

	return (
		<div>
			{iconUrl ? (
				<img
					src={iconUrl}
					alt="User Icon"
					style={{ width: '60px', height: '60px' }}
				/>
			) : (
				<img
					src="https://static.vecteezy.com/system/resources/thumbnails/034/715/051/small/user-icon-in-trendy-flat-style-isolated-on-black-background-user-silhouette-symbol-for-your-web-site-design-logo-app-ui-windows-vector.jpg"
					alt="Hardcoded Icon"
					style={{ width: '50px', height: '50px' }}
				/>
			)}
		</div>
	);
};

Icon.propTypes = {
	homeUserData: PropTypes.object,
	dashboardUserData: PropTypes.object,
	allGamesUserData: PropTypes.object,
	gamesDetailsUserData: PropTypes.object,
	boardDetailsUserData: PropTypes.object,
	searchResultsUserData: PropTypes.object,
};

export default Icon;
