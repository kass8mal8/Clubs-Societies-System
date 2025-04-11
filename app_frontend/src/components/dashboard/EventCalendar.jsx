import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles
import "./EventCalendar.css"; // Import custom styles

const EventCalendar = ({ events }) => {
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Handle date selection
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	// Disable tiles without events
	const tileDisabled = ({ date, view }) => {
		if (view === "month") {
			// Check if the date matches any event date
			const hasEvent = events?.some(
				(event) => new Date(event.date).toDateString() === date.toDateString()
			);
			return !hasEvent; // Disable tiles without events
		}
		return false;
	};

	// Add event titles inside calendar tiles
	const tileContent = ({ date, view }) => {
		if (view === "month") {
			// Check if the date matches any event date
			const matchingEvents = events?.filter(
				(event) => new Date(event.date).toDateString() === date.toDateString()
			);

			// Render event titles inside the tile
			if (matchingEvents?.length > 0) {
				return (
					<div className="text-xs mt-1">
						{matchingEvents.map((event) => (
							<div key={event._id}>{event.title}</div>
						))}
					</div>
				);
			}
		}
		return null;
	};

	return (
		<div className="mt-4 bg-white p-4 rounded w-[48%]">
			<h2 className="text-lg mb-4 text-gray-600">Event Calendar</h2>
			<Calendar
				onChange={handleDateChange}
				value={selectedDate}
				tileDisabled={tileDisabled} // Disable tiles without events
				tileContent={tileContent} // Add events inside tiles
				className="custom-calendar" // Apply custom styles
			/>
		</div>
	);
};

export default EventCalendar;
