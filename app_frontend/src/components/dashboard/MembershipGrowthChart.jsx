import React from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

const MembershipGrowthChart = ({ members }) => {
	// Prepare data for the chart
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

	// Aggregate membership growth by month
	const monthlyGrowth = Array(12).fill(0); // Initialize an array with 12 zeros
	members?.forEach((member) => {
		const joinDate = new Date(member.createdAt); // Assuming `joinDate` is in ISO format
		const monthIndex = joinDate.getMonth(); // Get the month (0-11)
		monthlyGrowth[monthIndex] += 1; // Increment the count for the corresponding month
	});

	// Cumulative growth
	const cumulativeGrowth = monthlyGrowth?.reduce((acc, value, index) => {
		acc.push((acc[index - 1] || 0) + value);
		return acc;
	}, []);

	// Chart data
	const data = {
		labels: months, // X-axis labels
		datasets: [
			{
				label: "Membership Growth",
				data: cumulativeGrowth, // Y-axis data
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				fill: true,
				tension: 0.4, // Smooth curve
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
				text: "Membership Growth Over Time",
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	return (
		<div className="w-[47%] ml-6 p-2 mx-auto bg-white rounded">
			<Line data={data} options={options} />
		</div>
	);
};

export default MembershipGrowthChart;
