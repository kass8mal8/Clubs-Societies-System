const User = require("../models/users");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { SECRET_KEY, ACCESS_TOKEN_EXPIRY, EMAIL_ADDRESS } = process.env;
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
	const min = 10000;
	const max = 99999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const signup = async (req, res) => {
	const { email, admission_number, password } = req.body;
	// console.log("Request", req);
	// Check if all fields are provided
	if (!admission_number || !password || !email) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		await User.create({
			password,
			admission_number,
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
			subject: "Legal Text Summarizer - OTP Verification", // Subject line
			text: `Your One-Time Password (OTP) is: ${generatedOTP}`, // plain text body
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "verify OTP sent to email", generatedOTP });
	} catch (error) {
		res.status(401).json({ message: error.message });
	}
};

const verifyOTP = async (req, res) => {
	const { otp, phone_number } = req.body;
	console.log(otp, phone_number);

	try {
		const user = await User.findOne({ phone_number });

		const { accessToken } = generateToken({
			admission_number: user.admission_number,
			phone_number: user.phone_number,
			id: user.id,
		});

		const dbOTP = bcrypt.compareSync(otp, user.otp);

		if (!dbOTP) return res.status(401).json({ message: "Invalid OTP" });

		await User.findOneAndUpdate({ phone_number }, { otp: null });

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

const signout = (req, res) => {
	req.session.destroy();

	res.clearCookie("token");
	res.status(200).json({ message: "Logged out successfully" });
};

const getUser = async (req, res) => {
	const { admission_number, email } = req.params;
	console.log(admission_number, email);
	try {
		const user = await User.find(
			email !== null ? { email } : { admission_number }
		);
		console.log("User:", user);
		if (user) {
			res.status(200).json({ user });
		} else {
			res.status(404).json({ message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const refreshAccessToken = (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(401).json({ message: "No refresh token provided" });
	}

	jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		const { accessToken } = generateToken({
			admission_number: user.admission_number,
			phone_number: user.phone_number,
			id: user.id,
		});

		res.status(200).json({ accessToken });
	});
};

module.exports = {
	signup,
	signin,
	verifyOTP,
	signout,
	authenticate,
	refreshAccessToken,
	getUser,
};
