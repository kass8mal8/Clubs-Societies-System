import { useState, useEffect, useRef } from 'react';
import illustration from '../../assets/images/illustration.png';
import Switch from './Switch';
import usePost from '../../hooks/usePost';
import pass_visible from '../../assets/images/pass_visible.png';
import pass_hidden from '../../assets/images/pass_hidden.png';
import Otp from './Otp';
import { useAuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';

const Auth = () => {
	const [isSignup, setIsSignup] = useState(false);
	const { post, loading } = usePost(
		`/auth/${isSignup ? 'signup' : 'signin'}`
	);
	const [userDetails, setUserDetails] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		name: '',
		email: '',
		password: '',
	});
	const [isVisible, setIsVisible] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const modalRef = useRef();
	const { user } = useAuthContext();

	const validateInputs = () => {
		let isValid = true;
		const newErrors = { name: '', email: '', password: '' };

		// Name validation (only for signup)
		if (isSignup && userDetails.name) {
			if (!/^[a-zA-Z\s]+$/.test(userDetails.name)) {
				newErrors.name = 'Name should only contain letters and spaces';
				isValid = false;
			}
			if (userDetails.name.length < 2) {
				newErrors.name = 'Name must be at least 2 characters long';
				isValid = false;
			}
		}
		if (isSignup && !userDetails.name) {
			newErrors.name = 'Name is required';
			isValid = false;
		}

		// Email validation
		if (!userDetails.email) {
			newErrors.email = 'Email is required';
			isValid = false;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
			newErrors.email = 'Please enter a valid email address';
			isValid = false;
		}

		// Password validation
		if (!userDetails.password) {
			newErrors.password = 'Password is required';
			isValid = false;
		} else if (userDetails.password.length < 8) {
			newErrors.password = 'Password must be at least 8 characters long';
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUserDetails({ ...userDetails, [name]: value });
		// Clear error when user starts typing
		setErrors({ ...errors, [name]: '' });
	};

	const handleAuth = async (e) => {
		e.preventDefault();

		if (!validateInputs()) {
			return;
		}

		try {
			const res = await post(userDetails);
			console.log('Response:', res);
			!isSignup ? setIsOpen(true) : setIsSignup(false);
		} catch (error) {
			console.log('Error:', error);
		}
	};

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
	}, [isOpen]);

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
					<div className="relative">
						<input
							type="text"
							placeholder="Full Name"
							name="name"
							value={userDetails.name}
							onChange={handleInputChange}
							className={`p-3 focus:outline-none border rounded-full block mx-auto my-3 w-full md:w-[45%] ${
								errors.name
									? 'border-red-500'
									: 'border-neutral-400'
							}`}
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1 w-full md:w-[45%] mx-auto">
								{errors.name}
							</p>
						)}
					</div>
				)}
				<div className="relative">
					<input
						type="email"
						placeholder="Email"
						name="email"
						value={userDetails.email}
						onChange={handleInputChange}
						className={`p-3 focus:outline-none border rounded-full block mx-auto my-4 w-full md:w-[45%] ${
							errors.email
								? 'border-red-500'
								: 'border-neutral-400'
						}`}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1 w-full md:w-[45%] mx-auto">
							{errors.email}
						</p>
					)}
				</div>
				<div className="relative">
					<input
						type={isVisible ? 'text' : 'password'}
						placeholder="Password"
						name="password"
						value={userDetails.password}
						onChange={handleInputChange}
						className={`p-3 focus:outline-none border rounded-full block mx-auto my-4 w-full md:w-[45%] ${
							errors.password
								? 'border-red-500'
								: 'border-neutral-400'
						}`}
					/>
					<img
						src={!isVisible ? pass_visible : pass_hidden}
						alt="visibility"
						onClick={() => setIsVisible(!isVisible)}
						className="w-5 cursor-pointer absolute right-3 md:right-[30%] top-5 opacity-50"
					/>
					{errors.password && (
						<p className="text-red-500 text-sm mt-1 w-full md:w-[45%] mx-auto">
							{errors.password}
						</p>
					)}
				</div>
				<button
					type="submit"
					className={`mx-auto w-full md:w-[45%] text-white bg-gray-800 p-3 rounded-full block my-2 ${
						loading && 'bg-neutral-200 text-black'
					}`}
					disabled={loading}
				>
					{loading ? 'processing...' : isSignup ? 'Signup' : 'Signin'}
				</button>
			</form>
			<dialog
				ref={modalRef}
				onClick={handleClose}
				className="mx-auto h-full md:h-[55%] mt-[50%] md:mt-[10%] p-0 md:mb-auto py-5 px-2 w-full md:w-[60%] rounded-2xl max-w-[50ch] backdrop:opacity-50 backdrop:bg-black"
			>
				<Otp email={userDetails?.email} />
			</dialog>
		</div>
	);
};

export default Auth;
