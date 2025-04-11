import { useState, useEffect, useTransition } from "react";
import axiosInstance from "../../utils/axiosInstance";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuthContext } from "../../context/AuthContext";

const AddContribution = ({ setContributions }) => {
	const [isPending, startTransition] = useTransition();
	const { user } = useAuthContext();
	const [contributionDetails, setContributionDetails] = useState({
		memberName: "",
		amount: "",
		createdBy: user?.id,
		month: null, // Use a Date object for the month
	});
	const [members, setMembers] = useState([]); // State to store the list of members

	// Fetch members from the backend
	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const res = await axiosInstance.get("/members");
				setMembers(res.data); // Assuming the backend returns an array of members
			} catch (error) {
				console.error("Failed to fetch members:", error);
			}
		};

		fetchMembers();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setContributionDetails({
			...contributionDetails,
			[name]: value,
		});
	};

	const handleMonthChange = (date) => {
		setContributionDetails({
			...contributionDetails,
			month: date, // Set the selected month as a Date object
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		startTransition(async () => {
			try {
				// Format the month as "MMMM yyyy" (e.g., "January 2025")
				const formattedMonth = contributionDetails.month
					? contributionDetails.month.toLocaleString("default", {
							month: "long",
					  })
					: "";

				// Prepare the data to send to the backend
				const contributionData = {
					...contributionDetails,
					month: formattedMonth,
				};

				console.log("Contribution Data:", contributionData);

				// Send the contribution data to the backend
				const res = await axiosInstance.post(
					"/contributions/add",
					contributionData
				);

				// Update the contributions list
				setContributions((prevContributions) => [
					...prevContributions,
					res?.data?.contribution,
				]);

				// Close the form
				handleClose();
			} catch (error) {
				console.error("Failed to add contribution:", error);
			}
		});
	};

	return (
		<form
			className="mx-auto flex flex-col w-full bg-white rounded p-4 text-gray-600"
			onSubmit={handleSubmit}
		>
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">Select Member</label>
				<select
					name="memberName"
					value={contributionDetails.memberName}
					onChange={handleChange}
					className="border rounded p-2.5 w-full border-gray-400 focus:outline-none"
					required
				>
					<option value="" disabled>
						Select a member
					</option>
					{members.map((member) => (
						<option key={member._id} value={member.name}>
							{member.name}
						</option>
					))}
				</select>
			</div>
			<input
				type="number"
				name="amount"
				placeholder="Contribution Amount"
				className="border rounded p-2.5 my-2 border-gray-400 focus:outline-none"
				onChange={handleChange}
				required
			/>
			<div className="mb-4">
				<label className="block text-sm font-medium mb-1">Select Month</label>
				<DatePicker
					selected={contributionDetails.month}
					onChange={handleMonthChange}
					className="border rounded p-2.5 w-full border-gray-400 focus:outline-none"
					placeholderText="Select Month"
					dateFormat="MMMM yyyy" // Format as "January 2025"
					showMonthYearPicker // Enable month and year picker
					required
				/>
			</div>
			<button
				type="submit"
				className="cursor-pointer p-3 my-2 rounded text-white bg-gray-600"
			>
				{isPending ? "Processing..." : "Submit"}
			</button>
		</form>
	);
};

export default AddContribution;
