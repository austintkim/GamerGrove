import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@galvanize-inc/jwtdown-for-react';

import './App.css'
import Home from './Home';
import Dashboard from "./components/Dashboard/dashboard";
import Listgames from './components/Games/Listgames';
import GameDetails from './components/GameDetails/gameDetails';
import NonUserGameDetails from './components/GameDetails/nonUserGameDetails';

import SignUpForm from './components/Accounts/SignUpForm';
import Welcome from './components/Accounts/Welcome';
import Login from './components/Accounts/Login';
import WelcomeBack from './components/Accounts/WelcomeBack';
import BoardForm from './components/Boards/BoardForm';
import Settings from './components/Accounts/Settings';
import DeleteAccountForm from './components/Accounts/DeleteAccountForm';

import UpdateReviewForm from './components/Reviews/UpdateReviewForm';
import DeleteReviewForm from './components/Reviews/DeleteReviewForm';
import SearchResults from './components/SearchResults/SearchResults';

import BoardPage from './components/Boards/boardPage';
import Hero from './components/Accounts/Hero';
import DeleteBoardForm from './components/Boards/DeleteBoardForm';
import UpdateBoardForm from './components/Boards/UpdateBoardForm';


// All your environment variables in vite are in this object
console.table(import.meta.env)
// When using environment variables, you should do a check to see if
// they are defined or not and throw an appropriate error message
const API_HOST = import.meta.env.VITE_API_HOST
if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
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

const MODE = import.meta.env.MODE

function App() {

    return (
        <AuthProvider baseUrl = {API_HOST}>
            { MODE === 'production' ? (
            <BrowserRouter basename='/gamer-grove'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route path="/signup/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/welcomeback" element={<WelcomeBack />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/delete/:id/:username" element={<DeleteAccountForm />} />
                    <Route path="/boards/create" element={<BoardForm />} />
                    <Route path="/boards/delete/:id" element={<DeleteBoardForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reviews/update/:review_id/:game_id" element={<UpdateReviewForm />} />
                    <Route path="/reviews/delete/:id" element={<DeleteReviewForm />} />
                    <Route path="/games" element={<Listgames />} />
                    <Route path="/games/:id" element={<GameDetails />} />
                    <Route path="/games/:id/nonuser" element={<NonUserGameDetails />} />
                    <Route path="/boards/:id" element={<BoardPage />} />
                    <Route path="/boards/update/:id" element={<UpdateBoardForm />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/dogo" element={<Hero />} />
                </Routes>
            </BrowserRouter>)
            : (<BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    <Route path="/signup/welcome" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/welcomeback" element={<WelcomeBack />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/delete/:id/:username" element={<DeleteAccountForm />} />
                    <Route path="/boards/create" element={<BoardForm />} />
                    <Route path="/boards/delete/:id" element={<DeleteBoardForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/reviews/update/:review_id/:game_id" element={<UpdateReviewForm />} />
                    <Route path="/reviews/delete/:id" element={<DeleteReviewForm />} />
                    <Route path="/games" element={<Listgames />} />
                    <Route path="/games/:id" element={<GameDetails />} />
                    <Route path="/games/:id/nonuser" element={<NonUserGameDetails />} />
                    <Route path="/boards/:id" element={<BoardPage />} />
                    <Route path="/boards/update/:id" element={<UpdateBoardForm />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/dogo" element={<Hero />} />
                </Routes>
            </BrowserRouter>
            )
        }
        </AuthProvider>
    )
}
export default App;
