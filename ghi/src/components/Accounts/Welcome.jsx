import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

function Welcome() {
	const navigate = useNavigate();
	const [countdown, setCountdown] = useState(5);

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		const timeout = setTimeout(() => {
			navigate('/');
			window.location.reload();
		}, 5000);

		return () => {
			clearInterval(interval);
			clearTimeout(timeout);
		};
	}, [navigate]);

	const handleBackToHomepage = () => {
		navigate('/');
		window.location.reload();
	};

	return (
		<div style={containerStyle}>
			<div
				className="card text-bg-light mb-3"
				style={{
					textAlign: 'center',
					padding: '1.5rem 2rem',
					borderRadius: '12px',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				}}
			>
				<div className="card-body">
					<h4
						style={{
							marginBottom: '1rem',
							fontWeight: 600,
						}}
					>
						Welcome to GamerGrove! 🎮
					</h4>
					<p style={{ marginBottom: '1rem' }}>
						We hope you have a blast exploring and sharing your
						favorite games! 🫶🫰
					</p>
					<p style={{ fontSize: '1rem', color: '#555' }}>
						You’ll be redirected to the homepage in{' '}
						<strong style={{ fontSize: '1.2rem' }}>
							{countdown}
						</strong>{' '}
						seconds.
					</p>
					<button
						onClick={handleBackToHomepage}
						className="btn btn-primary"
						style={{
							marginTop: '1rem',
							padding: '0.5rem 1rem',
							borderRadius: '6px',
							cursor: 'pointer',
						}}
					>
						Back to Homepage
					</button>
				</div>
			</div>
		</div>
	);
}

export default Welcome;
