import { useNavigate, useParams } from 'react-router-dom';
import './gameDetails.css';

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function NonUserGameDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div style={containerStyle}>
            <div className="card text-bg-light mb-3">
            <div className="card-body">
                <div>
                <h1>Either login or sign up to interact with this game! 🫶🫰</h1>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => navigate(`/games/${id}`)}> Back to Game Details </button>
                <button onClick={() => navigate('/signup')}> Sign Up </button>
                <button onClick={() => navigate('/login')}> Log In </button>
                </div>
            </div>
            </div>
        </div>
        );

    }

export default NonUserGameDetails;
