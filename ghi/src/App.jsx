import { AuthProvider } from '@galvanize-inc/jwtdown-for-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DownPage from './DownPage';

import './App.css';
import Dashboard from './components/Dashboard/dashboard';
import GameDetails from './components/GameDetails/gameDetails';
import NonUserGameDetails from './components/GameDetails/nonUserGameDetails';
import Listgames from './components/Games/Listgames';
import Home from './Home';

import DeleteAccountForm from './components/Accounts/DeleteAccountForm';
import ForgotPasswordForm from './components/Accounts/ForgotPasswordForm';
import Login from './components/Accounts/Login';
import Settings from './components/Accounts/Settings';
import SignUpForm from './components/Accounts/SignUpForm';
import Welcome from './components/Accounts/Welcome';
import WelcomeBack from './components/Accounts/WelcomeBack';
import BoardForm from './components/Boards/BoardForm';

import DeleteReviewForm from './components/Reviews/DeleteReviewForm';
import UpdateReviewForm from './components/Reviews/UpdateReviewForm';
import SearchResults from './components/SearchResults/SearchResults';

import BoardPage from './components/Boards/boardPage';
import DeleteBoardForm from './components/Boards/DeleteBoardForm';
import UpdateBoardForm from './components/Boards/UpdateBoardForm';

// All your environment variables in vite are in this object
console.table(import.meta.env);
// When using environment variables, you should do a check to see if
// they are defined or not and throw an appropriate error message
const API_HOST = import.meta.env.VITE_API_HOST;
if (!API_HOST) {
	throw new Error('VITE_API_HOST is not defined');
}
/**
 * This is an example of using JSDOC to define types for your component
 * @typedef {{module: number, week: number, day: number, min: number, hour: number}} LaunchInfo
 * @typedef {{launch_details: LaunchInfo, message?: string}} LaunchData
 *
 * @returns {React.ReactNode}
 */

// const domain = /https:\/\/[^/]+/;
// const basename = import.meta.env.VITE_PUBLIC_URL.replace(domain, '');

const MODE = import.meta.env.MODE;

function App() {
	const [isBackendUp, setIsBackendUp] = useState(true);
	useEffect(() => {
		const checkBackend = async () => {
			try {
				const response = await fetch(`${API_HOST}/api/health`);
				if (!response.ok) {
					throw new Error(`Server responded with ${response.status}`);
				}
				setIsBackendUp(true);
			} catch (err) {
				console.error('Backend is down:', err.message);
				setIsBackendUp(false);
			}
		};

		checkBackend();

		const interval = setInterval(checkBackend, 30000);
		return () => clearInterval(interval);
	}, []);

	if (!isBackendUp) {
		return <DownPage />;
	}
	return (
		<AuthProvider baseUrl={API_HOST}>
			{MODE === 'production' ? (
				<BrowserRouter basename="/gamer-grove">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<SignUpForm />} />
						<Route path="/signup/welcome" element={<Welcome />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/login/welcomeback"
							element={<WelcomeBack />}
						/>
						<Route path="/settings" element={<Settings />} />
						<Route
							path="/settings/delete/:id/:username"
							element={<DeleteAccountForm />}
						/>
						<Route
							path="/reset-password/:token"
							element={<ForgotPasswordForm />}
						/>

						<Route path="/boards/create" element={<BoardForm />} />
						<Route
							path="/boards/delete/:id"
							element={<DeleteBoardForm />}
						/>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route
							path="/reviews/update/:review_id/:game_id"
							element={<UpdateReviewForm />}
						/>
						<Route
							path="/reviews/delete/:id"
							element={<DeleteReviewForm />}
						/>
						<Route path="/games" element={<Listgames />} />
						<Route path="/games/:id" element={<GameDetails />} />
						<Route
							path="/games/:id/nonuser"
							element={<NonUserGameDetails />}
						/>
						<Route path="/boards/:id" element={<BoardPage />} />
						<Route
							path="/boards/update/:id"
							element={<UpdateBoardForm />}
						/>
						<Route path="/search" element={<SearchResults />} />
					</Routes>
				</BrowserRouter>
			) : (
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/signup" element={<SignUpForm />} />
						<Route path="/signup/welcome" element={<Welcome />} />
						<Route path="/login" element={<Login />} />
						<Route
							path="/login/welcomeback"
							element={<WelcomeBack />}
						/>
						<Route path="/settings" element={<Settings />} />
						<Route
							path="/settings/delete/:id/:username"
							element={<DeleteAccountForm />}
						/>
						<Route
							path="/reset-password/:token"
							element={<ForgotPasswordForm />}
						/>
						<Route path="/boards/create" element={<BoardForm />} />
						<Route
							path="/boards/delete/:id"
							element={<DeleteBoardForm />}
						/>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route
							path="/reviews/update/:review_id/:game_id"
							element={<UpdateReviewForm />}
						/>
						<Route
							path="/reviews/delete/:id"
							element={<DeleteReviewForm />}
						/>
						<Route path="/games" element={<Listgames />} />
						<Route path="/games/:id" element={<GameDetails />} />
						<Route
							path="/games/:id/nonuser"
							element={<NonUserGameDetails />}
						/>
						<Route path="/boards/:id" element={<BoardPage />} />
						<Route
							path="/boards/update/:id"
							element={<UpdateBoardForm />}
						/>
						<Route path="/search" element={<SearchResults />} />
					</Routes>
				</BrowserRouter>
			)}
		</AuthProvider>
	);
}
export default App;
