import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
// import { Outlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import MembersHeader from "./MembersHeader";
import MembersList from "./MembersList";

const Members = () => {
	const { user } = useAuthContext();
	const { data: members } = useFetch(`/members/`, "members");

	return (
		<div className="ml-[17%] mt-[6%] w-[82%] bg-white border rounded border-white">
			<MembersHeader />
			<MembersList members={members || []} />
			{/* <Outlet /> */}
		</div>
	);
};

export default Members;
