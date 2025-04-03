import { useLocation } from "react-router-dom";
import Profile from "../dashboard/Profile";

const Header = () => {
	const location = useLocation();
	const path = location.pathname;
	return (
		<div className="bg-white w-[83%] p-3 fixed top-0 items-center flex justify-between left-[17%] rounded-bl">
			<h2 className="font-bold text-xl">
				{path === "/" ? "Dashboard" : path.slice(1)}
			</h2>
			<Profile />
		</div>
	);
};

export default Header;
