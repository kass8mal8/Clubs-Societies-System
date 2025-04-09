import { useState, useTransition } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import usePost from "../../hooks/usePost";
import { format } from "date-fns";

const AddEvent = ({ handleClose, setEvents }) => {
	const url = "/events/add";
	const { post } = usePost(url);
	const [isPending, startTransition] = useTransition();
	const [eventDetails, setEventDetails] = useState({
		title: "",
		location: "",
		date: null, // Date object for the event date
		time: null, // Date object for the event time
		guests: [], // Initialize guests as an empty array
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		// Handle guests input separately
		if (name === "guests") {
			setEventDetails({
				...eventDetails,
				guests: value.split(",").map((guest) => guest.trim()), // Convert comma-separated string to an array
			});
		} else {
			setEventDetails({
				...eventDetails,
				[name]: value,
			});
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		// Format the data
		const formattedDate = format(eventDetails?.date, "MMMM d, yyyy"); // yyyy-MM-dd
		const formattedTime = eventDetails?.time.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}); // h:mm aa
		const formattedGuests = eventDetails?.guests?.map((guest) => ({
			name: guest,
		}));

		// Prepare the final event data
		const eventData = {
			title: eventDetails?.title,
			location: eventDetails?.location,
			date: formattedDate,
			time: formattedTime,
			guests: formattedGuests,
		};

		startTransition(async () => {
			try {
				// Send the data to the backend
				const res = await post(eventData);
				setEvents((prevEvents) => [...prevEvents, res?.event]);
				handleClose();
			} catch (error) {
				console.error("Failed to add event:", error.message);
			}
		});
	};

	return (
		<form
			className="mx-auto flex flex-col w-full bg-white rounded p-4 text-gray-600"
			onSubmit={handleSubmit}
		>
			<aside className="flex flex-row gap-2">
				<input
					type="text"
					name="title"
					placeholder="Event Title"
					className="border w-2/5 rounded p-2.5 my-2 border-gray-400 focus:outline-none"
					onChange={handleChange}
				/>
				<input
					type="text"
					name="location"
					placeholder="Event venue"
					className="border w-3/5 rounded p-2.5 my-2 border-gray-400 focus:outline-none"
					onChange={handleChange}
				/>
			</aside>
			<aside className="flex flex-row gap-2">
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Event Date</label>
					<DatePicker
						selected={eventDetails.date}
						onChange={(date) => setEventDetails({ ...eventDetails, date })}
						className="border w-full border-gray-400 rounded px-3 py-2 focus:outline-none"
						placeholderText="Select Event Date"
						dateFormat="MMMM d, yyyy"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Event Time</label>
					<DatePicker
						selected={eventDetails.time}
						onChange={(time) => setEventDetails({ ...eventDetails, time })}
						className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
						placeholderText="Select Event Time"
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={15}
						timeCaption="Time"
						dateFormat="h:mm aa"
						required
					/>
				</div>
			</aside>
			<input
				type="text"
				name="guests"
				placeholder="Guests (comma-separated)"
				className="border rounded p-2.5 my-2 border-gray-400 focus:outline-none"
				onChange={handleChange}
			/>
			<button
				type="submit"
				className="cursor-pointer p-3 my-2 rounded text-white bg-gray-600"
			>
				{isPending ? "Processing..." : "Submit"}
			</button>
			<p
				className="text-center mt-2 cursor-pointer p-1 text-sm text-gray-500"
				onClick={handleClose}
			>
				Close
			</p>
		</form>
	);
};

export default AddEvent;
