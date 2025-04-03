const Member = require("../models/members");

const addMember = async (req, res) => {
	const { admission_number, name, telephone } = req.body;
	try {
		const member = await Member.create({ name, telephone, admission_number });
		res.status(200).json({ message: `${member.name} created successfully.` });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const removeMember = async (req, res) => {
	const { memberId } = req.params;

	try {
		await Member.findByIdAndDelete(memberId);
		res.status(200).json({ message: "Member deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateMember = async (req, res) => {
	const { memberId } = req.params;
	const { updateDetails } = req.body;

	try {
		await Member.findByIdAndUpdate(memberId, { updateDetails });
		res.status(200).json({ message: "Member updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getMembers = async (req, res) => {
	try {
		const members = await Member.find({});
		res.status(200).json(members);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	addMember,
	removeMember,
	updateMember,
	getMembers,
};
