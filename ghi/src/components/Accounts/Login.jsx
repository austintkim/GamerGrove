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

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [incorrectLogin, setIncorrectLogin] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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
										<input
											style={{ marginBottom: '15px' }}
											type="submit"
											value="Login"
										/>
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginForm;
