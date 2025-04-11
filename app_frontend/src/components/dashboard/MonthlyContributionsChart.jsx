import React from "react";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const MonthlyContributionsChart = ({ contributions }) => {
	// Define months
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

	// Aggregate contributions by month
	const monthlyData = Array(12).fill(0); // Initialize an array with 12 zeros
	contributions?.forEach((contribution) => {
		const monthIndex = months.indexOf(contribution.month);
		if (monthIndex !== -1) {
			monthlyData[monthIndex] += contribution.amount;
		}
	});

	// Chart data
	const data = {
		labels: months, // X-axis labels
		datasets: [
			{
				label: "Contributions (KES)",
				data: monthlyData, // Y-axis data
				backgroundColor: "#8EC5FF",
				borderColor: "#8EC5FF",
				borderWidth: 1,
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
				text: "Monthly Contributions",
			},
		},
	};

	return (
		<div className="w-1/2 mx-auto bg-white rounded p-3">
			<Bar data={data} options={options} />
		</div>
	);
};

export default MonthlyContributionsChart;
