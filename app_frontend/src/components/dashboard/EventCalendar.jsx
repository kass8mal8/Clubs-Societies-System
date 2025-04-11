import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styles

const EventCalendar = ({ events }) => {
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Highlight dates with events
	const tileClassName = ({ date, view }) => {
		if (view === "month") {
			// Check if the date matches any event date
			const eventDates = events?.map((event) =>
				new Date(event.date).toDateString()
			);
			if (eventDates.includes(date.toDateString())) {
				return "bg-blue-500 text-blue-500 rounded-full"; // Tailwind classes for styling
			}
		}
		return null;
	};

	// Handle date selection
	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	return (
		<div className="rounded mt-4 flex space-x-3 text-gray-600">
			<div className="bg-white p-4 rounded">
				<h2 className="text-lg mb-4">Event Calendar</h2>
				<Calendar
					onChange={handleDateChange}
					value={selectedDate}
					tileClassName={tileClassName}
				/>
			</div>
			{/* Display events for the selected date */}
			<div className="mt-4">
				<h3 className="text-md">Events on {selectedDate.toDateString()}:</h3>
				<ul className="list-disc list-inside">
					{events
						?.filter(
							(event) =>
								new Date(event.date).toDateString() ===
								selectedDate.toDateString()
						)
						.map((event) => (
							<li key={event._id} className="text-gray-700">
								{event.title} - {event.location}
							</li>
						))}
				</ul>
			</div>
		</div>
	);
};

export default EventCalendar;
