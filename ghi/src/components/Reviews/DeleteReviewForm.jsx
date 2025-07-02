import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const containerStyle = {
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

const buttonStyle = {
	margin: '0 10px',
	padding: '10px 20px',
	borderRadius: '5px',
	cursor: 'pointer',
};

const greenButton = {
	...buttonStyle,
	backgroundColor: 'green',
	color: 'white',
};

const redButton = {
	...buttonStyle,
	backgroundColor: 'red',
	color: 'white',
};

async function fetchAccountId() {
	const tokenUrl = `${import.meta.env.VITE_API_HOST}/token`;

	const fetchConfig = {
		credentials: 'include',
	};

	try {
		const response = await fetch(tokenUrl, fetchConfig);

		if (response.ok) {
			const data = await response.json();
			return data.account.id;
		} else {
			console.error('Error fetching account ID:', response.status);
			return null;
		}
	} catch (error) {
		console.error('Error fetching account ID:', error);
		return null;
	}
}

const DeleteReviewForm = () => {
	const navigate = useNavigate();

	const { id } = useParams();
	const [accountId, setAccountId] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			const fetchedAccountId = await fetchAccountId();
			if (fetchedAccountId) {
				setAccountId(fetchedAccountId);
			} else {
				console.error('Error fetching account ID');
			}
		};

		fetchUserData();
	}, []);

	const handleDelete = async (event) => {
		event.preventDefault();

		const deleteUrl = `${import.meta.env.VITE_API_HOST}/api/reviews/${id}/${accountId}`;

		const deleteConfig = {
			method: 'delete',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const response = await fetch(deleteUrl, deleteConfig);
			if (response.ok) {
				navigate('/dashboard');
			} else {
				throw new Error('Failed to delete review');
			}
		} catch (error) {
			console.error('Error deleting review:', error);
		}
	};

	return (
		<div style={containerStyle}>
			<div className="card text-bg-light mb-3">
				<div className="card-body">
					<div>Are you sure you want to delete this review?</div>
					<button style={greenButton} onClick={handleDelete}>
						Yes
					</button>
					<button style={redButton} onClick={() => navigate(-1)}>
						No
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteReviewForm;
