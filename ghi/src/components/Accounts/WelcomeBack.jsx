import { useNavigate } from 'react-router-dom';

const containerStyle = {
	minHeight: '100vh',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

function WelcomeBack() {
	const navigate = useNavigate();
	const handleBackToHomepage = () => {
		navigate('/');
	};

	return (
		<div style={containerStyle}>
			<div className="card text-bg-light mb-3">
				<div className="card-body">
					<div>Welcome Back! We missed you... 🫶 🫰</div>
					<button onClick={handleBackToHomepage}>
						{' '}
						Back to Homepage{' '}
					</button>
				</div>
			</div>
		</div>
	);
}

export default WelcomeBack;
