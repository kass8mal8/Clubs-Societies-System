import { useState, useTransition } from "react";
import usePost from "../../hooks/usePost";

const AddMember = ({ handleClose, setMembers }) => {
	const url = "/members/add";
	const { post } = usePost(url);
	const [isPending, startTransition] = useTransition();
	const [memberDetails, setMemberDetails] = useState();

	const handleChange = (e) => {
		setMemberDetails({
			...memberDetails,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		startTransition(async () => {
			try {
				const res = await post(memberDetails);
				setMembers((prevMembers) => [...prevMembers, res?.member]);
				handleClose();
			} catch (error) {
				console.log(error.message);
			}
		});
		console.log(memberDetails);
	};

	return (
		<form
			className="mx-auto flex flex-col w-full bg-white rounded p-4"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				name="name"
				placeholder="full name"
				className="border rounded p-2.5 my-2 border-gray-400 focus:outline-none"
				onChange={handleChange}
			/>
			<input
				type="text"
				name="admission_number"
				placeholder="admission number"
				className="border rounded p-2.5 my-2 border-gray-400 focus:outline-none"
				onChange={handleChange}
			/>
			<input
				type="text"
				name="telephone"
				placeholder="phone number"
				className="border rounded p-2.5 my-2 border-gray-400 focus:outline-none"
				onChange={handleChange}
			/>
			<button
				type="submit"
				className="cursor-pointer p-3 my-2 rounded text-white bg-gray-600"
			>
				{isPending ? "processing..." : "submit"}
			</button>
			<p
				className="text-center mt-2 cursor-pointer p-1 text-sm text-gray-500"
				onClick={handleClose}
			>
				close
			</p>
		</form>
	);
};

export default AddMember;
