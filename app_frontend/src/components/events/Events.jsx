import useFetch from "../../hooks/useFetch";
import AddEvent from "./AddEvent";
import EVentsHeader from "./EventsHeader";
import EventsList from "./EventsList";
import { useEffect, useState, useRef } from "react";

const Events = () => {
	const { data } = useFetch("/events", "events");
	const [events, setEvents] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef();

	useEffect(() => {
		setEvents(data);
	}, [data]);

	const handleClose = (e) => {
		setIsOpen(false);
		modalRef.current?.close();
	};

	useEffect(() => {
		if (isOpen) modalRef.current?.showModal();
	}, [isOpen]);
	return (
		<div className="ml-[17%] mt-[6%] w-[82%] ">
			<button
				className="bg-gray-200 px-4 py-2 rounded mb-4 cursor-pointer"
				onClick={() => setIsOpen(true)}
			>
				Add New
			</button>
			{/* < /> */}
			<div className="bg-white border rounded border-white">
				<EVentsHeader />
				<EventsList events={events || []} setEvents={setEvents} />
			</div>
			<dialog
				ref={modalRef}
				className="mx-auto p-0 mt-[5%] py-5 px-2 rounded-2xl w-[40%] backdrop:opacity-65 backdrop:bg-black"
			>
				<AddEvent handleClose={handleClose} setEvents={setEvents} />
			</dialog>
		</div>
	);
};

export default Events;
