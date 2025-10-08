import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);
	const [accountData, setAccountData] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const navigate = useNavigate();

	const validateToken = async (token) => {
		const validateTokenUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/validate_token/${token}`;

		const validateTokenConfig = {
			method: 'GET',
			credentials: 'include',
		};

		try {
			const response = await fetch(validateTokenUrl, validateTokenConfig);
			const data = await response.json();
			if (response.ok && data) {
				setLoading(false);
				setValid(true);
				setAccountData(data.account);
			} else {
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
			validateToken(token);
		}
	}, [token]);

	const containerStyle = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh',
		backgroundColor: '#121212',
		textAlign: 'center',
	};

	if (loading) {
		return (
			<div style={containerStyle}>
				<p style={{ color: 'white' }}>Loading...</p>
			</div>
		);
	}

	if (valid) {
		return (
			<div style={containerStyle}>
				<p style={{ color: 'white' }}>
					This will be the forgot password form
				</p>
			</div>
		);
	} else {
		return (
			<div style={containerStyle}>
				<h1 style={{ color: 'white' }}>{errorMessage}</h1>
				<button
					type="button"
					onClick={() => navigate('/login')}
					style={{
						marginTop: '1rem',
						padding: '0.5rem 1rem',
						cursor: 'pointer',
					}}
				>
					Return to Login Page
				</button>
			</div>
		);
	}
};

export default ForgotPasswordForm;
