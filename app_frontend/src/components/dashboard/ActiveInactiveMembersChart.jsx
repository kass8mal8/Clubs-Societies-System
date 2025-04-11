import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ActiveInactiveMembersChart = ({ activeMembers, inactiveMembers }) => {
	// Data for the pie chart
	const data = {
		labels: ["Active Members", "Inactive Members"],
		datasets: [
			{
				data: [activeMembers, inactiveMembers], // Active vs. inactive counts
				backgroundColor: ["#81C784", "#E57373"], // Light green and light red
				hoverBackgroundColor: ["#66BB6A", "#EF5350"], // Slightly darker shades for hover
			},
		],
	};

	// Chart options
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			title: {
				display: true,
				text: "Active vs. Inactive Members",
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded w-1/2 mt-4">
			<h2 className="text-lg font-bold mb-4 text-gray-800">
				Membership Status
			</h2>
			<div className="w-full">
				<Doughnut data={data} options={options} />
			</div>
		</div>
	);
};

export default ActiveInactiveMembersChart;
