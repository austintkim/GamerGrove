import useToken from '@galvanize-inc/jwtdown-for-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import metalslime from '../../assets/metalslime.gif';

const containerStyle = {
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
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

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [incorrectLogin, setIncorrectLogin] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
	const [resetEmail, setResetEmail] = useState('');
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [error, setError] = useState('');

	const { login } = useToken();
	const navigate = useNavigate();

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const loginUrl = `${import.meta.env.VITE_API_HOST}/token`;
		const form = new FormData();
		form.append('username', username);
		form.append('password', password);
		const loginConfig = {
			method: 'post',
			body: form,
		};

		const response = await fetch(loginUrl, loginConfig);
		if (response.ok) {
			login(username, password);
			navigate('/dashboard');
		} else {
			setIncorrectLogin(true);
		}
	};

	const handleDismiss = () => {
		const alertElement = document.getElementById('failure-message');
		alertElement.style.opacity = '0';
		setTimeout(() => setIncorrectLogin(false), 300);
	};

	const handleReset = async (event) => {
		event.preventDefault();
		setError('');
		setResetEmail('');

		const resetUrl = `${
			import.meta.env.VITE_API_HOST
		}/api/accounts/forgot_password`;
		const resetConfig = {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: resetEmail }),
		};

		try {
			const response = await fetch(resetUrl, resetConfig);
			if (response.ok) {
				setShowSuccessMessage(true);
			} else {
				console.error('Failed to send reset email');
				setError(
					'We could not find an account associated with that email.'
				);
			}
		} catch (error) {
			console.error('Network or unexpected error:', error);
			setError('A network error occurred. Please try again.');
		}
	};

	const alertStyle = {
		display: incorrectLogin ? 'block' : 'none',
		minWidth: '280px',
		margin: '0 auto',
		marginBottom: '15px',
		whiteSpace: 'nowrap',
		opacity: incorrectLogin ? '1' : '0',
		transition: 'opacity 0.3s ease',
		position: 'relative',
	};

	return (
		<div style={{ position: 'relative' }}>
			<button
				onClick={() => {
					navigate('/');
				}}
				style={{
					position: 'absolute',
					top: '0',
					left: '0',
					margin: '10px',
				}}
			>
				Home Page!
			</button>
			<button
				onClick={() => {
					navigate('/signup');
				}}
				style={{
					position: 'absolute',
					top: '40px',
					left: '0',
					margin: '10px',
				}}
			>
				Sign Up!
			</button>
			<div>
				<img
					src={metalslime}
					alt=""
					style={{
						position: 'fixed',
						bottom: '45%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '150px',
						objectFit: 'contain',
						cursor: 'pointer',
						padding: '16px',
						zIndex: 3,
					}}
				/>
				<div style={containerStyle}>
					<div
						className="card text-bg-light mb-3"
						style={{ width: '100%', maxWidth: '600px' }}
					>
						<div className="offset-3 col-6">
							<h5
								className="card-header"
								style={{
									textAlign: 'center',
									fontSize: '36px',
								}}
							>
								Login
							</h5>
							<div className="card-body">
								<form onSubmit={(e) => handleSubmit(e)}>
									<div className="mb-3">
										<label className="form-label">
											Username:
										</label>
										<input
											name="username"
											type="text"
											className="form-control"
											onChange={(e) =>
												setUsername(e.target.value)
											}
										/>
									</div>
									<div className="mb-3">
										<label htmlFor="password">
											Password:
										</label>
										<div style={{ position: 'relative' }}>
											<input
												onChange={(e) =>
													setPassword(e.target.value)
												}
												required
												type={
													!showPassword || !password
														? 'password'
														: 'text'
												}
												name="password"
												id="password"
												className="form-control"
												value={password}
												style={{
													marginBottom: '15px',
													paddingRight: '40px',
												}}
											/>
											<button
												type="button"
												disabled={!password}
												onClick={
													togglePasswordVisibility
												}
												style={{
													position: 'absolute',
													right: '10px',
													top: '50%',
													transform:
														'translateY(-50%)',
													background: 'none',
													border: 'none',
													cursor: 'pointer',
												}}
											>
												{!showPassword || !password
													? '👁️'
													: '👁️‍🗨️'}
											</button>
										</div>
									</div>
									<div>
										<button
											style={{ marginBottom: '15px' }}
											type="submit"
										>
											Login
										</button>
									</div>
									<div
										className="alert alert-danger mb-0"
										id="failure-message"
										style={alertStyle}
									>
										Incorrect username or password...
										<button
											onClick={handleDismiss}
											type="button"
											className="close"
											style={{
												position: 'absolute',
												top: '0',
												right: '5px',
												fontSize: '16px',
											}}
										>
											<span aria-hidden="true">
												&times;
											</span>
										</button>
									</div>
								</form>
							</div>
							<div
								style={{
									display: 'flex',
									justifyContent: 'flex-start',
									padding: '10px',
								}}
							>
								<button
									type="button"
									onClick={() => setShowForgotPassword(true)}
									style={{
										background: 'none',
										border: 'none',
										color: 'blue',
										textDecoration: 'underline',
										cursor: 'pointer',
									}}
								>
									Forgot Password?
								</button>
							</div>
						</div>
					</div>
				</div>

				{showForgotPassword && (
					<div style={modalOverlayStyle}>
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
								Reset Password
							</div>
							<div className="card-body">
								<form onSubmit={handleReset}>
									<div className="mb-3">
										<label className="form-label">
											Email:
										</label>
										<input
											type="email"
											className="form-control"
											required
											value={resetEmail}
											onChange={(e) =>
												setResetEmail(e.target.value)
											}
											placeholder="Please enter the email associated with your account!"
										/>
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											gap: '10px',
										}}
									>
										<button
											type="button"
											onClick={() => {
												setShowForgotPassword(false);
												setError('');
											}}
											className="btn btn-secondary"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="btn btn-primary"
											onClick={() => {
												setError('');
											}}
										>
											Submit
										</button>
									</div>
									{error && (
										<div
											style={{
												color: 'red',
												marginTop: '8px',
											}}
										>
											{error}
										</div>
									)}
								</form>
							</div>
						</div>
					</div>
				)}
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
						A reset email has been sent! It is valid for 20 minutes.
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
		</div>
	);
};

export default LoginForm;
