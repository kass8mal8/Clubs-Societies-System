import { useState, useEffect } from "react";
import options from "../../assets/images/options.png";
import Skeleton from "../Skeleton";
import axiosInstance from "../../utils/axiosInstance";

const EventsList = ({ events, setEvents }) => {
	const [dropdownVisible, setDropdownVisible] = useState(null); // Track which event's dropdown is visible
	console.log("EventsList", events);

	const handleToggleDropdown = (eventId) => {
		setDropdownVisible((prev) => (prev === eventId ? null : eventId));
	};

	const handleDelete = async (eventId) => {
		try {
			await axiosInstance.delete(`/events/remove/${eventId}`);
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event._id !== eventId)
			);
		} catch (error) {
			console.error("Failed to delete event:", error);
		}
	};

	return (
		<div className="text-slate-600">
			{!events ? (
				<Skeleton />
			) : (
				<>
					{events?.length ? (
						<div>
							{events?.map((event) => (
								<ul
									key={event._id}
									className="grid gap-4 items-center odd:bg-gray-50 border-gray-300 py-2 px-4 relative [grid-template-columns:1fr_1fr_2fr_1fr_1fr_1fr_1fr]"
								>
									<li className="truncate">#{event._id.slice(-8)}</li>

									<li className="truncate">{event?.title}</li>

									<li className="truncate">{event.location}</li>

									<li className="truncate">{event.date}</li>

									<li className="truncate">{event.time}</li>
									<li className="truncate">
										{event.guests.map((guest) => (
											<span key={guest._id} className="mr-1">
												{guest.name}
											</span>
										))}
									</li>

									<li className="flex justify-center items-center relative">
										<img
											src={options}
											alt="options"
											className="w-4 h-1 opacity-55 cursor-pointer"
											onClick={() => handleToggleDropdown(event._id)}
										/>

										{/* Dropdown Menu */}
										{dropdownVisible === event._id && (
											<ul className="rounded text-sm absolute top-6 left-0 bg-white shadow-md p-2 z-10 text-gray-700">
												<li
													className="cursor-pointer hover:bg-gray-100 px-2 py-1"
													onClick={() => handleDelete(event._id)}
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
							No events yet available
						</p>
					)}
				</>
			)}
		</div>
	);
};

export default EventsList;
