const { Router } = require("express");
const {
	getContributions,
	addContribution,
	editContribution,
} = require("../controllers/contributions");
const router = new Router();

router.get("/", getContributions);
router.post("/add", addContribution);
router.put("/update/:contributionId", editContribution);

module.exports = router;
