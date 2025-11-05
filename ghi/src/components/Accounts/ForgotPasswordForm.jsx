import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pc from '../../assets/pc.gif';

const ForgotPasswordForm = () => {
	const { token } = useParams();
	const [accountId, setAccountId] = useState(null);
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

	// ✅ NEW STATE FOR PASSWORD STRENGTH
	const [passwordScore, setPasswordScore] = useState(null);
	const [showPasswordHint, setShowPasswordHint] = useState(false);

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
				setAccountId(Number(data.account.id));
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

	// ✅ PASSWORD STRENGTH CHECKER (copied from SignUpForm)
	const checkPasswordStrength = (password) => {
		let score = 0;
		if (password.length >= 8 && /[A-Z]/.test(password)) score++;
		if (password.length >= 8 && /[a-z]/.test(password)) score++;
		if (password.length >= 8 && /[0-9]/.test(password)) score++;
		if (password.length >= 8 && /[^A-Za-z0-9]/.test(password)) score++;
		setPasswordScore(score);
	};

	const toggleNewPasswordVisibility = () =>
		setShowNewPassword(!showNewPassword);
	const toggleNewPasswordConfirmVisibility = () =>
		setShowNewPasswordConfirm(!showNewPasswordConfirm);

	const handleReset = async (event) => {
		event.preventDefault();
		setPasswordErrorMessage('');
		setNewPasswordMismatch(false);

		// Require strength >= moderate (same as signup)
		if (passwordScore < 3) {
			setPasswordErrorMessage(
				'Password must be at least "Moderate" strength.'
			);
			return;
		}

		if (newPassword !== newPasswordConfirm) {
			setNewPasswordMismatch(true);
			return;
		}

		const changeUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/use_token/${token}/${accountId}`;
		const changeConfig = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ new_password: newPassword }),
		};

		try {
			const response = await fetch(changeUrl, changeConfig);
			if (response.ok) {
				setNewPassword('');
				setNewPasswordConfirm('');
				setShowSuccessMessage(true);
				setCountdown(3);

				const interval = setInterval(
					() => setCountdown((prev) => prev - 1),
					1000
				);
				setTimeout(() => {
					clearInterval(interval);
					navigate('/login');
				}, 3000);
			} else {
				setPasswordErrorMessage(
					'We could not change your password successfully.'
				);
			}
		} catch {
			setPasswordErrorMessage(
				'A network error occurred. Please try again later.'
			);
		}
	};

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					background: '#121212',
					color: 'white',
				}}
			>
				<p>Loading...</p>
			</div>
		);
	}

	if (!valid) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
					background: '#121212',
					color: 'white',
				}}
			>
				<h1>{tokenErrorMessage}</h1>
				<button onClick={() => navigate('/login')}>
					Return to Login
				</button>
			</div>
		);
	}

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0,0,0,0.5)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<img
				src={pc}
				alt=""
				style={{
					position: 'fixed',
					bottom: '52%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '250px',
				}}
			/>

			<div
				className="card text-bg-light mb-3"
				style={{ width: '100%', maxWidth: '500px' }}
			>
				<div
					className="card-header"
					style={{ textAlign: 'center', fontSize: '24px' }}
				>
					Change Password
				</div>
				<div className="card-body">
					<form onSubmit={handleReset}>
						{/* NEW PASSWORD INPUT */}
						<div className="mb-3">
							<label className="form-label">New Password:</label>
							<div style={{ position: 'relative' }}>
								<input
									className="form-control"
									required
									type={showNewPassword ? 'text' : 'password'}
									value={newPassword}
									onChange={(e) => {
										setNewPassword(e.target.value);
										checkPasswordStrength(e.target.value);
									}}
									style={{
										marginBottom: '8px',
										paddingRight: '40px',
									}}
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
									}}
								>
									{showNewPassword ? '👁️‍🗨️' : '👁️'}
								</button>
							</div>

							{/* ✅ Password Strength Meter */}
							{newPassword.length >= 8 && (
								<p>
									Password Strength:{' '}
									<span
										style={{
											color:
												passwordScore < 3
													? 'orange'
													: passwordScore === 3
													? 'yellow'
													: 'green',
										}}
									>
										{passwordScore < 3
											? 'Weak'
											: passwordScore === 3
											? 'Moderate'
											: 'Strong'}
									</span>
								</p>
							)}

							{/* ✅ Toggle Password Requirements */}
							<button
								type="button"
								onClick={() =>
									setShowPasswordHint(!showPasswordHint)
								}
								style={{
									background: 'none',
									border: 'none',
									color: '#007bff',
									textDecoration: 'underline',
									cursor: 'pointer',
								}}
							>
								Password requirements
							</button>

							{showPasswordHint && (
								<div
									style={{
										background: '#333',
										color: 'white',
										padding: '12px',
										borderRadius: '6px',
										marginTop: '6px',
									}}
								>
									<p style={{ marginBottom: '6px' }}>
										<strong>
											Must be at least 8 characters & meet
											3/4:
										</strong>
									</p>
									<ul
										style={{
											margin: 0,
											paddingLeft: '20px',
										}}
									>
										<li
											style={{
												color: /[a-z]/.test(newPassword)
													? 'lightgreen'
													: 'inherit',
											}}
										>
											Lowercase letter
										</li>
										<li
											style={{
												color: /[A-Z]/.test(newPassword)
													? 'lightgreen'
													: 'inherit',
											}}
										>
											Uppercase letter
										</li>
										<li
											style={{
												color: /[0-9]/.test(newPassword)
													? 'lightgreen'
													: 'inherit',
											}}
										>
											Number
										</li>
										<li
											style={{
												color: /[^A-Za-z0-9]/.test(
													newPassword
												)
													? 'lightgreen'
													: 'inherit',
											}}
										>
											Special character
										</li>
									</ul>
								</div>
							)}
						</div>

						{/* CONFIRM PASSWORD INPUT (unchanged except visibility toggle kept) */}
						<div className="mb-3">
							<label className="form-label">
								Confirm New Password:
							</label>
							<div style={{ position: 'relative' }}>
								<input
									className="form-control"
									required
									type={
										showNewPasswordConfirm
											? 'text'
											: 'password'
									}
									value={newPasswordConfirm}
									onChange={(e) =>
										setNewPasswordConfirm(e.target.value)
									}
									style={{
										marginBottom: '15px',
										paddingRight: '40px',
									}}
								/>
								<button
									type="button"
									disabled={!newPasswordConfirm}
									onClick={toggleNewPasswordConfirmVisibility}
									style={{
										position: 'absolute',
										right: '10px',
										top: '50%',
										transform: 'translateY(-50%)',
										background: 'none',
										border: 'none',
									}}
								>
									{showNewPasswordConfirm ? '👁️‍🗨️' : '👁️'}
								</button>
							</div>
						</div>

						{newPasswordMismatch && (
							<div className="alert alert-warning">
								Your new passwords do not match!
							</div>
						)}

						{passwordErrorMessage && (
							<div style={{ color: 'red' }}>
								{passwordErrorMessage}
							</div>
						)}

						<div
							style={{
								display: 'flex',
								justifyContent: 'flex-end',
							}}
						>
							<button type="submit" className="btn btn-primary">
								Submit
							</button>
						</div>
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
						textAlign: 'center',
					}}
				>
					<p>Your password has been successfully changed!</p>
					<p>
						You will be redirected in <strong>{countdown}</strong>{' '}
						seconds.
					</p>
				</div>
			)}
		</div>
	);
};

export default ForgotPasswordForm;
