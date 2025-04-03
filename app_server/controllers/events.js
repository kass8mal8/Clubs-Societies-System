const Event = require("../models/events");

const addEvent = async (req, res) => {
	const { location, time, date, guests, title } = req.body;

	try {
		const event = await Event.create({ location, time, date, guests, title });
		res.status(200).json({ message: `${event.title} created successfully` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEvents = async (req, res) => {
	try {
		const events = await Event.find({});
		res.status(200).json(events);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getEvent = async (req, res) => {
	const { eventId } = req.params;

	try {
		const event = await Event.findById(eventId);
		res.status(200).json(event);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateEvent = async (req, res) => {
	const { updateDetails } = req.body;
	const { eventId } = req.params;

	try {
		await Event.findByIdAndUpdate(eventId, { updateDetails });
		res.status(200).json({ message: "Updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getEvents,
	getEvent,
	addEvent,
	updateEvent,
};
