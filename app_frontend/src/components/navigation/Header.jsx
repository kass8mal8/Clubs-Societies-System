import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import profile from "../../assets/images/profile.png";
// import Profile from "../dashboard/Profile";

const Header = () => {
	const location = useLocation();
	const path = location.pathname;
	const { user } = useAuthContext();
	return (
		<div className="bg-white w-[82%] p-3 fixed top-0 items-center flex justify-between left-[18%] rounded-bl">
			<h2 className="font-bold text-xl">
				{path === "/" ? "Dashboard" : path.slice(1)}
			</h2>
			<div className="flex items-center space-x-2">
				<img
					className="h-6 w-6 rounded-full object-cover border border-gray-600 opacity-60"
					src={profile}
				/>
				<p className="text-gray-600">{user ? user.name : "username"}</p>
			</div>
		</div>
	);
};

export default Header;
