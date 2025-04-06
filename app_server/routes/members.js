const { Router } = require("express");
const {
	getMembers,
	addMember,
	updateMember,
	removeMember,
} = require("../controllers/members");
const router = new Router();

router.get("/", getMembers);
router.post("/add", addMember);
router.put("/update/:memberId", updateMember);
router.delete("/remove/:memberId", removeMember);

module.exports = router;
