import { useState, useEffect, useRef } from "react";
import illustration from "../../assets/images/illustration.png";
import Switch from "./Switch";
import usePost from "../../hooks/usePost";
import pass_visible from "../../assets/images/pass_visible.png";
import pass_hidden from "../../assets/images/pass_hidden.png";
import Otp from "./Otp";
import { useAuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

const Auth = () => {
	const [isSignup, setIsSignup] = useState(false);
	const { post, loading } = usePost(`/auth/${isSignup ? "signup" : "signin"}`);
	const [userDetails, setUserDetails] = useState({
		name: "",
		email: null,
		password: "",
	});
	const [isVisible, setIsVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef();
	const { user } = useAuthContext();

	const handleInputChange = async (e) => {
		const { name, value } = e.target;
		setUserDetails({ ...userDetails, [name]: value });
	};

	const handleAuth = async (e) => {
		e.preventDefault();

		try {
			const res = await post(userDetails);
			console.log("Response:", res);
			!isSignup ? setIsOpen(true) : setIsSignup(false);
		} catch (error) {
			console.log("Error:", error);
		}
	};

	console.log(user);

	const handleClose = (e) => {
		const dimensions = modalRef.current?.getBoundingClientRect();
		if (dimensions) {
			if (
				e.clientX < dimensions.left ||
				e.clientX > dimensions.right ||
				e.clientY < dimensions.top ||
				e.clientY > dimensions.bottom
			) {
				setIsOpen(false);
				modalRef.current?.close();
			}
		}
	};

	useEffect(() => {
		if (isOpen) modalRef.current?.showModal();
	}, [isOpen, userDetails]);

	return (
		<div className="md:flex justify-between items-center h-screen">
			<div className="w-[100vw] h-[45vh] md:h-auto md:w-2/3 bg-gray-700 md:rounded-tr-4xl md:rounded-br-4xl">
				<img
					src={illustration}
					alt="illustration"
					className="w-2/3 mx-auto md:w-full"
				/>
			</div>
			<form
				className="relative bottom-0 w-full ml-4 md:w-3/4 mx-auto"
				onSubmit={handleAuth}
			>
				<Switch setIsSignup={setIsSignup} isSignup={isSignup} />
				{isSignup && (
					<input
						type="text"
						placeholder="Full Name"
						name="name"
						onChange={handleInputChange}
						className="p-3 focus:outline-none border border-neutral-400 rounded-full block mx-auto my-3 w-full md:w-[45%]"
					/>
				)}
				<input
					type="email"
					placeholder="Email"
					name="email"
					onChange={handleInputChange}
					className="p-3 focus:outline-none border border-neutral-400 rounded-full block mx-auto my-4 w-full md:w-[45%]"
				/>

				<aside className="relative">
					<input
						type={isVisible ? "text" : "password"}
						placeholder="Password"
						name="password"
						onChange={handleInputChange}
						className="p-3 focus:outline-none border border-neutral-400 rounded-full block mx-auto my-4 w-full md:w-[45%]"
					/>
					<img
						src={!isVisible ? pass_visible : pass_hidden}
						alt="visibility"
						onClick={() => setIsVisible(!isVisible)}
						className="w-5 cursor-pointer absolute right-3 md:right-[30%] top-5 opacity-50"
					/>
				</aside>
				<button
					type="submit"
					className={`mx-auto w-full md:w-[45%] text-white bg-gray-800 p-3 rounded-full block my-2 ${
						loading && "bg-neutral-200 text-black"
					}`}
				>
					{loading ? "processing..." : isSignup ? "Signup" : "Signin"}
				</button>
			</form>
			<dialog
				ref={modalRef}
				onClick={handleClose}
				className="mx-auto h-full md:h-[55%] mt-[50%] md:mt-[10%] p-0  md:mb-auto py-5 px-2 w-full md:w-[60%] rounded-2xl max-w-[50ch] backdrop:opacity-50 backdrop:bg-black"
			>
				<Otp email={userDetails?.email} />
			</dialog>
		</div>
	);
};

export default Auth;
