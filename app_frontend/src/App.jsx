import Auth from "./components/auth/Auth";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/navigation/Header";
import { useState } from "react";
import SideNav from "./components/navigation/SideNav";

function App() {
	const location = useLocation();
	// const [activeLink, setActiveLink] = useState("Home");

	return (
		<AuthProvider>
			<div className="text-slate-700 sm:w-full w-[90%] sm:mx-auto relative bg-gray-50">
				{location.pathname !== "/auth" && (
					<>
						<Header />
						<SideNav />
					</>
				)}

				<Routes>
					<Route path="/auth" element={<Auth />} />
				</Routes>
			</div>
		</AuthProvider>
	);
}

export default App;
