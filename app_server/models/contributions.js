const { model, Schema } = require("mongoose");

const contributionSchema = new Schema({
	amount: {
		type: Number,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	memberId: {
		type: Schema.Types.ObjectId,
		ref: "Member",
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
