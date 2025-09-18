import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const processToken = async (token) => {
		const processTokenUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/process_token/${token}`;

		const processTokenConfig = {
			method: 'PUT',
			credentials: 'include',
		};

		try {
			const response = await fetch(processTokenUrl, processTokenConfig);
			if (response.ok) {
				setLoading(false);
				setValid(true);
			} else {
				const data = await response.json();
				console.warn('Token error:', data.detail);
				setErrorMessage(data.detail);
				setLoading(false);
				setValid(false);
			}
		} catch (error) {
			console.error('Network or unexpected error:', error);
			setErrorMessage('Unexpected error. Please try again.');
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			processToken(token);
		}
	}, [token]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (valid) {
		return (
			<p style={{ color: 'white' }}>
				This will be the forgot password form
			</p>
		);
	} else {
		return <p style={{ color: 'white' }}>{errorMessage}</p>;
	}
};

export default ForgotPasswordForm;
