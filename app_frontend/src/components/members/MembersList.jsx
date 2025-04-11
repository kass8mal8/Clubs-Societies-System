import { useState, useEffect } from "react";
import options from "../../assets/images/options.png";
import Skeleton from "../Skeleton";
import axiosInstance from "../../utils/axiosInstance";

const MembersList = ({ members, setMembers }) => {
	const [dropdownVisible, setDropdownVisible] = useState(null); // Track which member's dropdown is visible

	const handleToggleDropdown = (memberId) => {
		setDropdownVisible((prev) => (prev === memberId ? null : memberId));
	};

	const handleStatusChange = async (memberId, newStatus) => {
		try {
			await axiosInstance.patch(`/members/update/${memberId}`, {
				reg_status: newStatus,
			});
			setMembers((prevMembers) =>
				prevMembers.map(
					(member) =>
						member._id === memberId
							? { ...member, reg_status: newStatus } // Create a new object with updated reg_status
							: member // Return the original member object
				)
			);
		} catch (error) {
			console.error("Failed to update status:", error);
		}
	};

	const handleDelete = async (memberId) => {
		try {
			// Delete the member via API
			await axiosInstance.delete(`/members/remove/${memberId}`);
			setMembers((prevMembers) =>
				prevMembers.filter((member) => member._id !== memberId)
			);
		} catch (error) {
			console.error("Failed to delete member:", error);
		}
	};

	return (
		<div className="text-slate-600">
			{!members ? (
				<Skeleton />
			) : (
				<>
					{members?.length ? (
						<div>
							{members?.map((member) => (
								<ul
									key={member._id}
									className="flex justify-between items-center odd:bg-gray-50 members-center border-gray-300 py-2 px-4 relative"
								>
									<li className="pr-8 w-[100px] text-left">
										#{member._id.slice(-8)}
									</li>

									<li className="w-[170px] ml-4">{member?.admission_number}</li>

									<li className="pl-8 pr-8 w-[180px] -ml-4">{member.name}</li>

									<li className="px-3 py-1 rounded text-sm w-[50px] text-center">
										{member.telephone}
									</li>
									<li className="w-[180px] text-center -mr-16 pl-8">
										{member.reg_status}
									</li>

									<li className="pl-10 w-[100px] flex space-x-4 relative">
										<img
											src={options}
											alt="options"
											className="w-4 h-1 opacity-55 cursor-pointer ml-6"
											onClick={() => handleToggleDropdown(member._id)}
										/>

										{/* Dropdown Menu */}
										{dropdownVisible === member._id && (
											<div className="absolute top-6 left-0 bg-white border rounded shadow-md p-2 z-10">
												<ul className="text-sm text-gray-700">
													<li
														className="cursor-pointer hover:bg-gray-100 px-2 py-1"
														onClick={() => handleDelete(member._id)}
													>
														Delete
													</li>
													{member.reg_status === "Inactive" && (
														<li
															className="cursor-pointer hover:bg-gray-100 px-2 py-1"
															onClick={() =>
																handleStatusChange(member._id, "Active")
															}
														>
															Active
														</li>
													)}
													{member.reg_status === "Active" && (
														<li
															className="cursor-pointer hover:bg-gray-100 px-2 py-1"
															onClick={() =>
																handleStatusChange(member._id, "Inactive")
															}
														>
															Inactive
														</li>
													)}
												</ul>
											</div>
										)}
									</li>
								</ul>
							))}
						</div>
					) : (
						<p className="mt-5 text-center text-gray-500">
							No members yet available
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default MembersList;
