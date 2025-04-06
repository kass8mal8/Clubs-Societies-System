const { Schema, model } = require("mongoose");

const memberSchema = new Schema({
	admission_number: {
		type: String,
		required: true,
		unique: true,
	},
	reg_status: {
		type: String,
		enum: ["Active", "Inactive"],
		default: "Active",
	},
	name: {
		type: String,
		required: true,
	},
	telephone: {
		type: String,
		required: true,
		unique: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

module.exports = model("Member", memberSchema);
