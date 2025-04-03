const { Router } = require("express");
const {
	signup,
	signin,
	verifyOTP,
	authenticate,
	getUser,
	refreshAccessToken,
} = require("../controllers/users");
const router = new Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify_otp", verifyOTP);
router.get("/profile", authenticate, (req, res) => {
	res.json({ user: req.user });
});
router.get("/user/:admission_number/:email", getUser);
router.post("/refresh_token", refreshAccessToken);

module.exports = router;
