import gears from './assets/gears.gif';
export default function MaintenancePage() {
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
			<h1>GamerGrove is Under Maintenance</h1>
			<p>
				Please check back shortly. We&apos;re working to get things back
				online!
			</p>
		</div>
	);
}
