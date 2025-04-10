const ContributionHeader = () => {
	return (
		<ul className="grid gap-4 items-center border-b border-gray-300 py-2 px-4 relative [grid-template-columns:1fr_2fr_1fr_1fr_1fr]">
			<li>Id</li>
			<li>Member Name</li>
			<li>Amount</li>
			<li>Month</li>
			<li>Actions</li>
		</ul>
	);
};

export default ContributionHeader;
