import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);

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
			}
			setLoading(false);
			console.warn('Token not processed');
		} catch (error) {
			console.error('Network or unexpected error:', error);
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
			<div>
				<p style={{ color: 'white' }}>
					{' '}
					This will be the forgot password form{' '}
				</p>
			</div>
		);
	} else {
		return (
			<div>
				<p style={{ color: 'white' }}>
					{' '}
					Your token has either already been used or expired.
				</p>
			</div>
		);
	}
};

export default ForgotPasswordForm;
