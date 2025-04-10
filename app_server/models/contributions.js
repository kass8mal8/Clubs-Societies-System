const { model, Schema } = require("mongoose");

const contributionSchema = new Schema({
	amount: {
		type: Number,
		required: true,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},

	memberName: {
		type: String,
		required: true,
	},
	month: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model("Contribution", contributionSchema);
