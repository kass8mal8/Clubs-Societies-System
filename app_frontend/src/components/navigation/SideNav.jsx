import members from "../../assets/images/members.png";
import events from "../../assets/images/event.png";
import contributions from "../../assets/images/contribution.png";
import dashboard from "../../assets/images/dashboard.png";
import { useLocation, useNavigate } from "react-router-dom";

const SideNav = () => {
	const endPoints = ["/", "members", "contributions", "events"];
	const location = useLocation();
	const path = location.pathname.slice(1);
	const navigate = useNavigate();

	console.log(path.slice(1));
	return (
		<div className="bg-white w-[15%] h-[100lvh] fixed top-0 left-0">
			<ul className="flex flex-col space-y-4 mt-10">
				<aside
					className={`${
						endPoints[0] === location.pathname.slice(0) &&
						"flex border-l-4 border-blue-300 bg-blue-50"
					} flex space-x-3 items-center p-2 hover:bg-blue-50 transition-all duration-200`}
					onClick={() => navigate("/")}
				>
					<img src={dashboard} alt="dashboard" className="w-4 h-4 opacity-55" />
					<li className="cursor-pointer">Dashboard</li>
				</aside>
				<aside
					className={`${
						endPoints[1] === path &&
						"flex border-l-4 border-blue-300 bg-blue-50"
					} flex space-x-3 items-center p-2 hover:bg-blue-50 transition-all duration-200`}
					onClick={() => navigate("/members")}
				>
					<img src={members} alt="dashboard" className="w-4 h-4 opacity-55" />
					<li className="cursor-pointer">Members</li>
				</aside>
				<aside
					className={`${
						endPoints[2] === path &&
						"flex border-l-4 border-blue-300 bg-blue-50"
					} flex space-x-3 items-center p-2 hover:bg-blue-50 transition-all duration-200`}
					onClick={() => navigate("/contributions")}
				>
					<img
						src={contributions}
						alt="dashboard"
						className="w-4 h-4 opacity-55"
					/>
					<li className="cursor-pointer">Contributions</li>
				</aside>
				<aside
					className={`${
						endPoints[3] === path &&
						"flex border-l-4 border-blue-300 bg-blue-50"
					} flex space-x-3 items-center p-2 hover:bg-blue-50 transition-all duration-200`}
					onClick={() => navigate("/events")}
				>
					<img src={events} alt="dashboard" className="w-4 h-4 opacity-55" />
					<li className="cursor-pointer">Events</li>
				</aside>
			</ul>
		</div>
	);
};

export default SideNav;
