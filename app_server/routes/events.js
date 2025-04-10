const { Router } = require("express");
const {
	getEvents,
	getEvent,
	addEvent,
	removeEvent,
} = require("../controllers/events");
const router = new Router();

router.get("/", getEvents);
router.post("/add", addEvent);
router.delete("/remove/:eventId", removeEvent);

module.exports = router;
