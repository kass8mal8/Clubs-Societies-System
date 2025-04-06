import Auth from "./components/auth/Auth";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/navigation/Header";
import { useState } from "react";
import SideNav from "./components/navigation/SideNav";
import Members from "./components/members/members";

function App() {
	const location = useLocation();
	// const [activeLink, setActiveLink] = useState("Home");

	return (
		<AuthProvider>
			{location.pathname !== "/auth" && (
				<>
					<Header />
					<SideNav />
				</>
			)}
			{/* <Members /> */}

			<Routes>
				<Route path="/auth" element={<Auth />} />
				<Route path="/members" element={<Members />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
