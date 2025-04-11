import { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import ContributionList from "./ContributionList";
import ContributionHeader from "./ContributionHeader";
import AddContribution from "./AddContribution";

const Contribution = () => {
	const { user } = useAuthContext();
	const url = `/contributions/${user?.id}`;
	const { data } = useFetch(url, "contributions");
	const [contributions, setContributions] = useState([]);

	useEffect(() => {
		setContributions(data);
	}, [data]);
	return (
		<div className="ml-[17%] mt-[6%] w-[82%] flex space-x-3">
			<section className="w-[65%] bg-white rounded">
				<ContributionHeader />
				<ContributionList
					contributions={contributions}
					setContributions={setContributions}
				/>
			</section>
			<section className="w-[30%]">
				<AddContribution setContributions={setContributions} />
			</section>
		</div>
	);
};

export default Contribution;
