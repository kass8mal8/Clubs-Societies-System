const Overview = ({ members, month, totalContribution, events }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 text-gray-600">
			<div className="bg-white p-4 rounded">
				<h2 className="text-lg">Total Members</h2>
				<p className="text-xl text-gray-500">{members?.length}</p>
			</div>
			<div className="bg-white p-4 rounded">
				<h2 className="text-lg">{month} - Total Contributions</h2>
				<p className="text-xl text-gray-500">KES {totalContribution}</p>
			</div>
			<div className="bg-white p-4 rounded">
				<h2 className="text-lg">Upcoming Events</h2>
				<p className="text-xl text-gray-500">{events?.slice(-1)[0].title}</p>
			</div>
		</div>
	);
};

export default Overview;
