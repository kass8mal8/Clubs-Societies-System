const { Schema, model, default: mongoose } = require("mongoose");

const eventSchema = new Schema({
	location: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	time: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	guests: {
		type: [
			{
				name: String,
			},
		],
		required: true,
		default: [],
	},
});

module.exports = model("Event", eventSchema);
