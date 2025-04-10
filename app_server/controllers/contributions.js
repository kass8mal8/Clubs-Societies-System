const Contribution = require("../models/contributions");

const addContribution = async (req, res) => {
	const { memberId, amount, month, createdBy, memberName } = req.body;

	try {
		const contribution = await Contribution.create({
			memberId,
			amount,
			month,
			createdBy,
			memberName,
		});
		res
			.status(200)
			.json({ message: "Contribution added successfully", contribution });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getContributions = async (req, res) => {
	const { userId } = req.params;
	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}
	try {
		const contributions = await Contribution.find({ createdBy: userId });
		res.status(200).json(contributions);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const editContribution = async (req, res) => {
	const { contributionId, updateDetails } = req.body;

	try {
		await Contribution.findByIdAndUpdate(contributionId, { updateDetails });
		res.status(200).json({ message: "Contribution updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	addContribution,
	getContributions,
	editContribution,
};
