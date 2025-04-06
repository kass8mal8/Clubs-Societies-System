const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, ACCESS_TOKEN_EXPIRY, EMAIL_ADDRESS, APP_PASSWORD } =
	process.env;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail", // Use your email service provider (e.g., Gmail, Outlook)
	auth: {
		user: EMAIL_ADDRESS, // Your email address
		pass: APP_PASSWORD, // Your email password or app-specific password
	},
});

const generateToken = (payload) => {
	const accessToken = jwt.sign(payload, SECRET_KEY, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
		algorithm: "HS256",
	});

	const refreshToken = jwt.sign(payload, SECRET_KEY, {
		expiresIn: "7d", // Set the refresh token expiry time (e.g., 7 days)
		algorithm: "HS256",
	});

	return { accessToken, refreshToken };
};

// generate otp

const generateOTP = () => {
	const min = 100000;
	const max = 999999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const signup = async (req, res) => {
	const { email, password, name } = req.body;
	// console.log("Request", req);
	// Check if all fields are provided
	if (!name || !password || !email) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		await User.create({
			password,
			name,
			email,
		});

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	try {
		await User.login(email, password);

		const generatedOTP = generateOTP();

		const salt = await bcrypt.genSalt(10);
		const hashedOTP = await bcrypt.hash(String(generatedOTP), salt);
		await User.findOneAndUpdate({ email }, { otp: hashedOTP });

		const mailOptions = {
			from: EMAIL_ADDRESS,
			to: email,
			subject: "Club Management - OTP Verification", // Subject line
			text: `Your One-Time Password (OTP) is: ${generatedOTP}`, // plain text body
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "verify OTP sent to email", generatedOTP });
	} catch (error) {
		console.log("Error:", message);
		res.status(401).json({ message: error.message });
	}
};

const verifyOTP = async (req, res) => {
	const { otp, email } = req.body;
	console.log(otp, email);

	try {
		const user = await User.findOne({ email });

		const { accessToken } = generateToken({
			email: user.email,
			name: user.name,
			id: user.id,
		});

		const dbOTP = bcrypt.compareSync(otp, user.otp);

		if (!dbOTP) return res.status(401).json({ message: "Invalid OTP" });

		await User.findOneAndUpdate({ email }, { otp: null });

		res
			.status(200)
			.json({ message: "Authenticated successfully", accessToken });
	} catch (error) {
		console.log("Error:", error.message);
		res.status(500).json({ error: error.message });
	}
};

const authenticate = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) {
			console.log(err.message);
			return res.status(403).json({ message: "Invalid token" });
		}

		req.user = user;
		next();
	});
};

module.exports = {
	signup,
	signin,
	verifyOTP,
	authenticate,
};
