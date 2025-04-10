const Event = require("../models/events");
const Member = require("../models/members");
const axios = require("axios");
const url = "https://api2.tiaraconnect.io/api/messaging/sendsms";
const { TIARA_CONNECT_API_KEY } = process.env; // Ensure you have this in your .env file

const addEvent = async (req, res) => {
	const { location, time, date, guests, title } = req.body;

	try {
		const event = await Event.create({ location, time, date, guests, title });

		const members = await Member.find({}); // Fetch only phone numbers
		console.log(members);

		// Send SMS to all members
		const smsPromises = members.map((member) => {
			const smsData = {
				from: "TIARACONECT",
				to: member.telephone,
				message: `Hi ${member.name} we welcome you to "${event.title}".The event will be held at ${event.location} on ${event.date} from ${event.time}.`,
			};

			return axios.post(url, smsData, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${TIARA_CONNECT_API_KEY}`,
				},
			});
		});
		await Promise.all(smsPromises);

		res
			.status(200)
			.json({ message: `${event.title} created successfully`, event });
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

const removeEvent = async (req, res) => {
	const { eventId } = req.params;

	try {
		const event = await Event.findByIdAndDelete(eventId);
		res.status(200).json({ message: `${event.title} deleted successfully` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getEvents,
	addEvent,
	removeEvent,
};
