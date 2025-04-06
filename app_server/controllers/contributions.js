const Contribution = require("../models/contributions");

const addContribution = async (req, res) => {
	const { memberId, amount, month, userId } = req.body;

	try {
		const contribution = await Contribution.create({
			memberId,
			amount,
			month,
			userId,
		});
		res.status(200).json({ message: "Contribution added successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getContributions = async (req, res) => {
	try {
		const contributions = await Contribution.find({}).populate({ memberId });
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
