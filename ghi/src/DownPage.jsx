import gears from './assets/gears.gif';
export default function DownPage() {
	return (
		<div style={{ textAlign: 'center', padding: '25rem', color: 'white' }}>
			<img
				src={gears}
				alt=""
				style={{
					position: 'fixed',
					bottom: '52%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '250px',
					objectFit: 'contain',
					cursor: 'pointer',
					zIndex: 3,
				}}
			/>
			<h1>GamerGrove is Currently Experiencing Issues</h1>
			<p>
				Please check back shortly. We&apos;re working to get things back
				online!
			</p>
		</div>
	);
}
