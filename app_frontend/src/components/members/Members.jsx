import { useEffect, useState, useRef } from "react";
import useFetch from "../../hooks/useFetch";
// import { Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import MembersHeader from "./MembersHeader";
import MembersList from "./MembersList";
import AddMember from "./AddMember";

const Members = () => {
	const { data: members } = useFetch(`/members/`, "members");
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef();
	const [membersArr, setMembersArr] = useState([]);

	useEffect(() => {
		setMembersArr(members);
	}, [members]);

	const handleClose = (e) => {
		setIsOpen(false);
		modalRef.current?.close();
	};

	useEffect(() => {
		if (isOpen) modalRef.current?.showModal();
	}, [isOpen]);

	return (
		<div className="ml-[17%] mt-[6%] w-[82%]">
			<button
				className="bg-gray-200 px-4 py-2 rounded mb-4 cursor-pointer"
				onClick={() => setIsOpen(true)}
			>
				Add New
			</button>
			<div className="bg-white border rounded border-white">
				<MembersHeader />
				<MembersList members={membersArr || []} setMembers={setMembersArr} />
			</div>
			<dialog
				ref={modalRef}
				// onClick={handleClose}
				className="mx-auto  mt-[10%] p-0  py-5 px-2 rounded-2xl max-w-[50ch] backdrop:opacity-65 backdrop:bg-black"
			>
				<AddMember handleClose={handleClose} setMembers={setMembersArr} />
			</dialog>
		</div>
	);
};

export default Members;
