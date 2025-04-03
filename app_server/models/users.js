const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
	otp: {
		type: String,
		default: null,
	},
	email: {
		type: String,
		unique: true,
		required: true,
	},
	user_role: {
		type: Number,
		enum: [100, 200, 300], // 100 is normal, 200 is admin, 300 is superadmin
		default: 100,
	},
	password: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

// Hash the password before saving
UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.statics.login = async function (email, password) {
	try {
		const user = await this.findOne({ email });

		if (user && bcrypt.compareSync(password, user.password)) {
			return user;
		}
		throw new Error("Incorrect credentials");
	} catch (error) {
		throw error;
	}
};

module.exports = model("User", UserSchema);
