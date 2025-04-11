import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
import useFetch from "../../hooks/useFetch";
import { useAuthContext } from "../../context/AuthContext";
import Overview from "./Overview";
import MonthlyContributionsChart from "./MonthlyContributionsChart";
import MembershipGrowthChart from "./MembershipGrowthChart";
import EventCalendar from "./EventCalendar";
import ActiveInactiveMembersChart from "./ActiveInactiveMembersChart";

const Dashboard = () => {
	const { user } = useAuthContext();
	const url = `/contributions/${user?.id}`;

	const [totalContribution, setTotalContribution] = useState(0);
	const { data: events } = useFetch("/events", "events");
	const { data: members } = useFetch("/members", "members");
	const { data: contributions } = useFetch(url, "contributions");

	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currentMonth = new Date().getMonth(); // Get the current month (0-11)

	const currentContributions = contributions?.filter(
		(contribution) => contribution.month === months[currentMonth]
	);
	const contribution = currentContributions?.reduce(
		(acc, contribution) => acc + contribution.amount,
		0
	);

	useEffect(() => {
		setTotalContribution(contribution);
	}, [contribution]);

	// Calculate active and inactive members
	const activeMembers =
		members?.filter((member) => member.reg_status === "Active").length || 0;
	const inactiveMembers =
		members?.filter((member) => member.reg_status === "Inactive").length || 0;

	return (
		<div className="ml-[17%] mt-[6%] w-[82%]">
			<Overview
				month={months[currentMonth]}
				totalContribution={totalContribution}
				events={events}
				members={members}
			/>
			<section className="flex">
				<MonthlyContributionsChart contributions={contributions} />
				<MembershipGrowthChart members={members} />
			</section>
			<section className="flex justify-between">
				<EventCalendar events={events} />
				<ActiveInactiveMembersChart
					activeMembers={activeMembers}
					inactiveMembers={inactiveMembers}
				/>
			</section>
		</div>
	);
};

export default Dashboard;
