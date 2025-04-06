const { Router } = require("express");
const {
	getEvents,
	getEvent,
	addEvent,
	updateEvent,
} = require("../controllers/events");
const router = new Router();

router.get("/", getEvents);
router.get("/:eventId", getEvent);
router.post("/add", addEvent);
router.put("/update/:eventId", updateEvent);

module.exports = router;
