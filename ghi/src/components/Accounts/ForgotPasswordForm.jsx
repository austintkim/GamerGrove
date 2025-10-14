import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pc from '../../assets/pc.gif';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [loading, setLoading] = useState(true);
	const [valid, setValid] = useState(false);
	const [tokenErrorMessage, setTokenErrorMessage] = useState('');
	const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
	const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
	const [newPasswordMismatch, setNewPasswordMismatch] = useState(false);
	const [countdown, setCountdown] = useState(3);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
			} else {
				console.warn('Token error:', data.detail);
				setTokenErrorMessage(data.detail);
				setLoading(false);
				setValid(false);
			}
		} catch (error) {
			console.error('Network or unexpected error:', error);
			setTokenErrorMessage('Unexpected error. Please try again.');
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

	const modalOverlayStyle = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	};

	const handleDismissNewPassword = () => {
		const alertElement = document.getElementById(
			'warning-message-new-password'
		);
		alertElement.style.opacity = '0';
		setTimeout(() => setNewPasswordMismatch(false), 300);
	};

	const alertStyleNewPassword = {
		display: newPasswordMismatch ? 'flex' : 'none',
		maxWidth: '280px',
		padding: '5px 15px',
		whiteSpace: 'nowrap',
		opacity: newPasswordMismatch ? '1' : '0',
		transition: 'opacity 0.3s ease',
	};

	const toggleNewPasswordVisibility = () => {
		setShowNewPassword(!showNewPassword);
	};

	const toggleNewPasswordConfirmVisibility = () => {
		setShowNewPasswordConfirm(!showNewPasswordConfirm);
	};

	const handleReset = async (event) => {
		event.preventDefault();

		setPasswordErrorMessage('');
		setNewPasswordMismatch(false);

		if (newPassword !== newPasswordConfirm) {
			setNewPasswordMismatch(true);
			return;
		}

		const changeUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/use_token/${token}`;

		const changeConfig = {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ new_password: newPassword }),
		};

		try {
			const response = await fetch(changeUrl, changeConfig);

			if (response.ok) {
				setNewPassword('');
				setNewPasswordConfirm('');

				setShowSuccessMessage(true);
				setCountdown(3);

				const interval = setInterval(() => {
					setCountdown((prev) => prev - 1);
				}, 1000);

				setTimeout(() => {
					clearInterval(interval);
					navigate('/login');
				}, 3000);
			} else {
				console.error('Failed to change password');
				setPasswordErrorMessage(
					'We could not change your password successfully.'
				);
			}
		} catch (error) {
			console.error('Network or unexpected error', error);
			setPasswordErrorMessage(
				'A network error occurred. Please try again later.'
			);
		}
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
			<div style={modalOverlayStyle}>
				<img
					src={pc}
					alt=""
					style={{
						position: 'fixed',
						bottom: '52%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '250px',
						objectFit: 'contain',
						cursor: 'pointer',
						padding: '16px',
						zIndex: 3,
					}}
				/>
				<div
					className="card text-bg-light mb-3"
					style={{
						width: '100%',
						maxWidth: '500px',
					}}
				>
					<div
						className="card-header"
						style={{
							textAlign: 'center',
							fontSize: '24px',
						}}
					>
						Change Password
					</div>
					<div className="card-body">
						<form onSubmit={handleReset}>
							<div className="mb-3">
								<label className="form-label">
									New Password:
								</label>
								<div style={{ position: 'relative' }}>
									<input
										className="form-control"
										required
										type={
											!showNewPassword || !newPassword
												? 'password'
												: 'text'
										}
										value={newPassword}
										name="new-password"
										id="new-password"
										style={{
											marginBottom: '15px',
											paddingRight: '40px',
										}}
										onChange={(e) =>
											setNewPassword(e.target.value)
										}
									/>
									<button
										type="button"
										disabled={!newPassword}
										onClick={toggleNewPasswordVisibility}
										style={{
											position: 'absolute',
											right: '10px',
											top: '50%',
											transform: 'translateY(-50%)',
											background: 'none',
											border: 'none',
											cursor: 'pointer',
										}}
									>
										{!showNewPassword || !newPassword
											? '👁️'
											: '👁️‍🗨️'}
									</button>
								</div>
							</div>
							<div className="mb-3">
								<label className="form-label">
									New Password Confirmation:
								</label>
								<div style={{ position: 'relative' }}>
									<input
										className="form-control"
										required
										type={
											!showNewPasswordConfirm ||
											!newPasswordConfirm
												? 'password'
												: 'text'
										}
										name="new-password-confirm"
										id="new-password-confirm"
										style={{
											marginBottom: '15px',
											paddingRight: '40px',
										}}
										value={newPasswordConfirm}
										onChange={(e) =>
											setNewPasswordConfirm(
												e.target.value
											)
										}
									/>
									<button
										type="button"
										disabled={!newPasswordConfirm}
										onClick={
											toggleNewPasswordConfirmVisibility
										}
										style={{
											position: 'absolute',
											right: '10px',
											top: '50%',
											transform: 'translateY(-50%)',
											background: 'none',
											border: 'none',
											cursor: 'pointer',
										}}
									>
										{!showNewPasswordConfirm ||
										!newPasswordConfirm
											? '👁️'
											: '👁️‍🗨️'}
									</button>
								</div>
							</div>
							<div
								className="alert alert-warning mb-0"
								id="warning-message-new-password"
								style={alertStyleNewPassword}
							>
								Your new passwords do not match!
								<button
									onClick={handleDismissNewPassword}
									type="button"
									className="close"
									style={{
										position: 'absolute',
										top: '0',
										right: '5px',
										fontSize: '16px',
									}}
								>
									<span aria-hidden="true">&times;</span>
								</button>
							</div>

							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-end',
									gap: '10px',
								}}
							>
								<button
									type="submit"
									className="btn btn-primary"
									onClick={() => {
										setPasswordErrorMessage('');
									}}
								>
									Submit
								</button>
							</div>
							{passwordErrorMessage && (
								<div
									style={{
										color: 'red',
										marginTop: '8px',
									}}
								>
									{passwordErrorMessage}
								</div>
							)}
						</form>
					</div>
				</div>
				{showSuccessMessage && (
					<div
						className="alert alert-success"
						style={{
							position: 'fixed',
							bottom: '40px',
							left: '50%',
							transform: 'translateX(-50%)',
							minWidth: '350px',
							maxWidth: '90%',
							textAlign: 'center',
							zIndex: 1100,
						}}
					>
						<p>Your password has been successfully changed!</p>
						<p>
							You will be redirected to the login page in{' '}
							<strong>{countdown}</strong> seconds.
						</p>
						<button
							onClick={() => setShowSuccessMessage(false)}
							type="button"
							className="close"
							style={{
								position: 'absolute',
								top: '5px',
								right: '10px',
								background: 'none',
								border: 'none',
								fontSize: '20px',
								cursor: 'pointer',
							}}
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div style={containerStyle}>
				<h1 style={{ color: 'white' }}>{tokenErrorMessage}</h1>
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
