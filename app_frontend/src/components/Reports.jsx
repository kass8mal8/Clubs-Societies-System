import { useState, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import useFetch from '../hooks/useFetch';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Reports.css'; // Import custom CSS for PDF rendering

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const Reports = () => {
	const { user } = useAuthContext();
	const [dateRange, setDateRange] = useState({
		startDate: '',
		endDate: '',
	});
	const { data: contributions, loading } = useFetch(
		`/contributions/${user?.id}`,
		'contributions'
	);
	const { data: members } = useFetch('/members', 'members');
	const { data: events } = useFetch('/events', 'events');
	const reportRef = useRef(null);

	// Handle date range change
	const handleDateChange = (e) => {
		const { name, value } = e.target;
		setDateRange((prev) => ({ ...prev, [name]: value }));
	};

	// Filter contributions by date range
	const filteredContributions = Array.isArray(contributions)
		? contributions.filter((contribution) => {
				const createdAt = new Date(contribution.createdAt);
				const startDate = dateRange.startDate
					? new Date(dateRange.startDate)
					: new Date(0);
				const endDate = dateRange.endDate
					? new Date(dateRange.endDate)
					: new Date();
				return createdAt >= startDate && createdAt <= endDate;
		  })
		: [];

	// Process contributions by month
	const contributionsByMonth = filteredContributions.reduce((acc, curr) => {
		const month = curr.month;
		acc[month] = (acc[month] || 0) + curr.amount;
		return acc;
	}, {});

	// Prepare data for contribution chart
	const contributionChartData = {
		labels: Object.keys(contributionsByMonth),
		datasets: [
			{
				label: 'Contributions (Ksh)',
				data: Object.values(contributionsByMonth),
				backgroundColor: 'rgba(75, 192, 192, 0.6)',
				borderColor: 'rgb(75, 192, 192)',
				borderWidth: 1,
			},
		],
	};

	// Filter upcoming events by date range
	const filteredEvents = Array.isArray(events)
		? events
				.filter((event) => {
					const eventDate = new Date(event.date);
					const startDate = dateRange.startDate
						? new Date(dateRange.startDate)
						: new Date(0);
					const endDate = dateRange.endDate
						? new Date(dateRange.endDate)
						: new Date();
					return eventDate >= startDate && eventDate <= endDate;
				})
				.sort((a, b) => new Date(a.date) - new Date(b.date))
				.slice(0, 5)
		: [];

	// Club details
	const totalContributions = filteredContributions.reduce(
		(sum, curr) => sum + curr.amount,
		0
	);
	const totalMembers = Array.isArray(members) ? members.length : 0;
	const upcomingEventsCount = filteredEvents.length;

	// Generate and download PDF
	const handleDownloadPDF = async () => {
		if (!reportRef.current) return;

		try {
			const canvas = await html2canvas(reportRef.current, {
				scale: 2,
				useCORS: true,
				logging: false,
				onclone: (doc) => {
					// Ensure the cloned document uses the pdf-report class
					const report = doc.querySelector('.pdf-report');
					if (report) {
						report.style.backgroundColor = '#ffffff';
						report.style.color = '#000000';
					}
				},
			});
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 190; // A4 width minus margins
			const pageHeight = 295; // A4 height
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;
			let position = 0;

			// Add first page
			pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			// Add additional pages if needed
			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			// Download PDF
			pdf.save(
				`Club_Report_${new Date().toISOString().split('T')[0]}.pdf`
			);
		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Failed to generate PDF. Please try again.');
		}
	};

	return (
		<div className="ml-[17%] mt-[6%] w-[82%]">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">System Reports</h1>
				<button
					onClick={handleDownloadPDF}
					className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Download PDF'}
				</button>
			</div>

			<div ref={reportRef} className="pdf-report">
				{/* Date Range Picker */}
				<div className="mb-6 bg-white p-4 rounded-lg shadow">
					<h2 className="text-lg font-semibold mb-2">
						Select Date Range
					</h2>
					<div className="flex flex-col sm:flex-row gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Start Date
							</label>
							<input
								type="date"
								name="startDate"
								value={dateRange.startDate}
								onChange={handleDateChange}
								className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								End Date
							</label>
							<input
								type="date"
								name="endDate"
								value={dateRange.endDate}
								onChange={handleDateChange}
								className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>

				{/* Club Details */}
				<div className="mb-6 bg-white p-6 rounded-lg shadow">
					<h2 className="text-xl font-semibold mb-4">
						Club Overview
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="p-4 bg-gray-50 rounded-md">
							<p className="text-sm text-gray-600">
								Total Members
							</p>
							<p className="text-2xl font-bold">{totalMembers}</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-md">
							<p className="text-sm text-gray-600">
								Total Contributions
							</p>
							<p className="text-2xl font-bold">
								Ksh {totalContributions}
							</p>
						</div>
						<div className="p-4 bg-gray-50 rounded-md">
							<p className="text-sm text-gray-600">
								Upcoming Events
							</p>
							<p className="text-2xl font-bold">
								{upcomingEventsCount}
							</p>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="text-center">Loading reports...</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Contributions by Month */}
						<div className="bg-white p-6 rounded-lg shadow md:col-span-2">
							<h2 className="text-xl font-semibold mb-4">
								Contributions by Month
							</h2>
							{Object.keys(contributionsByMonth).length > 0 ? (
								<Bar
									data={contributionChartData}
									options={{
										responsive: true,
										plugins: {
											legend: { position: 'top' },
											title: {
												display: true,
												text: 'Monthly Contributions',
											},
										},
									}}
								/>
							) : (
								<p className="text-gray-600">
									No contributions in selected period.
								</p>
							)}
							<p className="mt-4 text-sm text-gray-600">
								Total Contributions: Ksh {totalContributions}
							</p>
						</div>

						{/* Upcoming Events */}
						<div className="bg-white p-6 rounded-lg shadow md:col-span-2">
							<h2 className="text-xl font-semibold mb-4">
								Upcoming Events
							</h2>
							{filteredEvents.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left text-gray-500">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50">
											<tr>
												<th className="px-6 py-3">
													Title
												</th>
												<th className="px-6 py-3">
													Date
												</th>
												<th className="px-6 py-3">
													Time
												</th>
												<th className="px-6 py-3">
													Location
												</th>
												<th className="px-6 py-3">
													Guests
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredEvents.map((event) => (
												<tr
													key={event._id}
													className="bg-white border-b"
												>
													<td className="px-6 py-4">
														{event.title}
													</td>
													<td className="px-6 py-4">
														{event.date}
													</td>
													<td className="px-6 py-4">
														{event.time}
													</td>
													<td className="px-6 py-4">
														{event.location}
													</td>
													<td className="px-6 py-4">
														{event.guests
															?.map((g) => g.name)
															.join(', ') ||
															'None'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-gray-600">
									No upcoming events in selected period.
								</p>
							)}
						</div>

						{/* Contribution Summary */}
						<div className="bg-white p-6 rounded-lg shadow md:col-span-2">
							<h2 className="text-xl font-semibold mb-4">
								Contribution Summary
							</h2>
							{filteredContributions.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="w-full text-sm text-left text-gray-500">
										<thead className="text-xs text-gray-700 uppercase bg-gray-50">
											<tr>
												<th className="px-6 py-3">
													Member
												</th>
												<th className="px-6 py-3">
													Month
												</th>
												<th className="px-6 py-3">
													Amount
												</th>
												<th className="px-6 py-3">
													Date
												</th>
											</tr>
										</thead>
										<tbody>
											{filteredContributions
												.slice(0, 10)
												.map((contribution) => (
													<tr
														key={contribution._id}
														className="bg-white border-b"
													>
														<td className="px-6 py-4">
															{
																contribution.memberName
															}
														</td>
														<td className="px-6 py-4">
															{contribution.month}
														</td>
														<td className="px-6 py-4">
															Ksh{' '}
															{
																contribution.amount
															}
														</td>
														<td className="px-6 py-4">
															{new Date(
																contribution.createdAt
															).toLocaleDateString()}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-gray-600">
									No contributions in selected period.
								</p>
							)}
							{filteredContributions.length > 10 && (
								<p className="mt-4 text-sm text-gray-600">
									Showing 10 of {filteredContributions.length}{' '}
									contributions
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Reports;
