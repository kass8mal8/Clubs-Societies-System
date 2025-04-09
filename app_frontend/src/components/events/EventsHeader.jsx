const EVentsHeader = () => {
	return (
		<ul className="grid gap-4 items-center border-b border-gray-300 py-2 px-4 relative [grid-template-columns:1fr_1fr_2fr_1fr_1fr_1fr_1fr]">
			<li>Event Id</li>
			<li>Title</li>
			<li>Venue</li>
			<li>Date</li>
			<li>Time</li>
			<li>Guests</li>
			<li>Actions</li>
		</ul>
	);
};

export default EVentsHeader;
