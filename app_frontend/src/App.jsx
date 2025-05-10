import Auth from './components/auth/Auth';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/navigation/Header';
import { useState, useEffect } from 'react';
import SideNav from './components/navigation/SideNav';
import Members from './components/members/members';
import Events from './components/events/Events';
import Contribution from './components/contributions/Contribution';
import Dashboard from './components/dashboard/Dashboard';
import Reports from './components/Reports';

function App() {
	const location = useLocation();
	const navigate = useNavigate();
	// const [activeLink, setActiveLink] = useState("Home");

	useEffect(() => {
		// Skip check if already on auth page
		if (location.pathname === '/auth') return;

		const checkToken = () => {
			const token = localStorage.getItem('accessToken');

			if (!token) {
				navigate('/auth');
				return;
			}

			try {
				// Decode JWT payload
				const payload = JSON.parse(atob(token.split('.')[1]));
				const currentTime = Math.floor(Date.now() / 1000);

				// Check if token is expired
				if (payload.exp && payload.exp < currentTime) {
					localStorage.removeItem('accessToken');
					navigate('/auth');
				}
			} catch (error) {
				// If token is invalid, remove it and redirect
				localStorage.removeItem('accessToken');
				navigate('/auth');
			}
		};

		checkToken();
	}, [location.pathname, navigate]);

	return (
		<AuthProvider>
			{location.pathname !== '/auth' && (
				<>
					<Header />
					<SideNav />
				</>
			)}

			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/members" element={<Members />} />
				<Route path="/events" element={<Events />} />
				<Route path="/contributions" element={<Contribution />} />
				<Route path="/reports" element={<Reports />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
