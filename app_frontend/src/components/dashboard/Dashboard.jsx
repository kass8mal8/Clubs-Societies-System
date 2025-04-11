import { useEffect, useState } from "react";
// import axiosInstance from "../../utils/axiosInstance";
import useFetch from "../../hooks/useFetch";
import { useAuthContext } from "../../context/AuthContext";
import Overview from "./Overview";
import MonthlyContributionsChart from "./MonthlyContributionsChart";
import MembershipGrowthChart from "./MembershipGrowthChart";
import EventCalendar from "./EventCalendar";

const Dashboard = () => {
	const { user } = useAuthContext();
	const url = `/members/${user?.id}`;
	const [overview, setOverview] = useState({
		totalMembers: 0,
		totalContributions: 0,
		upcomingEvents: 0,
	});
	// const [totalContribution, setTotalContribution] = useState(0);
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
	const totalContribution = currentContributions?.reduce(
		(acc, contribution) => acc + contribution.amount,
		0
	);

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
			<EventCalendar events={events} />
		</div>
	);
};

export default Dashboard;
