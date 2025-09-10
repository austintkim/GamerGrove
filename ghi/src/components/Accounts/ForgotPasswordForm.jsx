import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);

	console.log(token);

	const fetchToken = async (token) => {
		const processTokenUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/process_token/${token}`;
		const response = await fetch(processTokenUrl);
		if (response.ok) {
			setLoading(false);
			setValid(true);
		} else {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (token) {
			fetchToken(token);
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
				<p style={{ color: 'white' }}> Your token is invalid.</p>
			</div>
		);
	}
};

export default ForgotPasswordForm;
