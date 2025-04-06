import members from "../../assets/images/members.png";
import events from "../../assets/images/event.png";
import contributions from "../../assets/images/contribution.png";
import dashboard from "../../assets/images/dashboard.png";

const SideNav = () => {
	return (
		<div className="bg-white w-[15%] h-[100lvh] fixed top-0 left-0">
			<ul className="flex flex-col space-y-4 mt-10">
				<aside className="flex space-x-3 items-center p-2  hover:bg-blue-50 hover:border-l-4 border-blue-300 transition-all duration-200">
					<img src={dashboard} alt="dashboard" className="w-5 h-5 opacity-55" />
					<li className="cursor-pointer">Dashboard</li>
				</aside>
				<aside className="flex space-x-3 items-center p-2  hover:bg-blue-50 hover:border-l-4 border-blue-300 transition-all duration-200">
					<img src={members} alt="dashboard" className="w-5 h-5 opacity-55" />
					<li className="cursor-pointer">Members</li>
				</aside>
				<aside className="flex space-x-3 items-center p-2  hover:bg-blue-50 hover:border-l-4 border-blue-300 transition-all duration-200">
					<img
						src={contributions}
						alt="dashboard"
						className="w-5 h-5 opacity-55"
					/>
					<li className="cursor-pointer">Contributions</li>
				</aside>
				<aside className="flex space-x-3 items-center p-2  hover:bg-blue-50 hover:border-l-4 border-blue-300 transition-all duration-200">
					<img src={events} alt="dashboard" className="w-5 h-5 opacity-55" />
					<li className="cursor-pointer">Events</li>
				</aside>
			</ul>
		</div>
	);
};

export default SideNav;
