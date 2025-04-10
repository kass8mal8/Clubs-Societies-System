import { useState, useEffect } from "react";
import options from "../../assets/images/options.png";
import Skeleton from "../Skeleton";
import axiosInstance from "../../utils/axiosInstance";

const ContributionList = ({ contributions, setContributions }) => {
	const [dropdownVisible, setDropdownVisible] = useState(null); // Track which contribution's dropdown is visible
	console.log("ContributionList", contributions);

	const handleToggleDropdown = (contributionId) => {
		setDropdownVisible((prev) =>
			prev === contributionId ? null : contributionId
		);
	};

	const handleDelete = async (contributionId) => {
		try {
			await axiosInstance.delete(`/contributions/remove/${contributionId}`);
			setContributions((prevcontributions) =>
				prevcontributions.filter(
					(contribution) => contribution._id !== contributionId
				)
			);
		} catch (error) {
			console.error("Failed to delete contribution:", error);
		}
	};

	return (
		<div className="text-slate-600">
			{!contributions ? (
				<Skeleton />
			) : (
				<>
					{contributions?.length ? (
						<div className="bg-white">
							{contributions?.map((contribution) => (
								<ul
									key={contribution._id}
									className="grid gap-4 items-center odd:bg-gray-50 border-gray-300 py-2 px-4 relative [grid-template-columns:1fr_2fr_1fr_1fr_1fr]"
								>
									<li className="truncate">#{contribution._id.slice(-8)}</li>

									<li className="truncate">{contribution?.memberName}</li>

									<li className="truncate">{contribution.amount}</li>

									<li className="truncate">{contribution.month}</li>

									<li className="flex -ml-8 justify-center items-center relative">
										<img
											src={options}
											alt="options"
											className="w-4 h-1 opacity-55 cursor-pointer"
											onClick={() => handleToggleDropdown(contribution._id)}
										/>

										{/* Dropdown Menu */}
										{dropdownVisible === contribution._id && (
											<ul className="rounded text-sm absolute top-6 left-0 bg-white shadow-md p-2 z-10 text-gray-700">
												<li
													className="cursor-pointer hover:bg-gray-100 px-2 py-1"
													onClick={() => handleDelete(contribution._id)}
												>
													Delete
												</li>
											</ul>
										)}
									</li>
								</ul>
							))}
						</div>
					) : (
						<p className="mt-5 text-center text-gray-500">
							No contributions yet available
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default ContributionList;
