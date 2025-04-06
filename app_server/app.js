const express = require("express");
require("dotenv").config();
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const authRoute = require("./routes/users");
const membersRoute = require("./routes/members");
const eventsRoute = require("./routes/events");
const contributionsRoute = require("./routes/contributions");
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173", // frontend URL
		credentials: true, // Allow cookies to be sent and received
	})
);

// Security measures
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"], // Allow loading scripts from same origin
				//   scriptSrc: ["'self'", "https://trusted-cdn.com"], // Allow scripts from trusted sources
				objectSrc: ["'none'"], // Block Flash/Plugins
			},
		},
		frameguard: { action: "deny" }, // Prevent Clickjacking
		referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Control Referrer Header
		xssFilter: true, // Prevent XSS Attacks
		dnsPrefetchControl: { allow: false }, // Prevent DNS Prefetching
	})
);

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/members", membersRoute);
app.use("/api/events", eventsRoute);
app.use("/api/contributions", contributionsRoute);

module.exports = app;
