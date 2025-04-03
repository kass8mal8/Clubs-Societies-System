import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api",
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			const refreshToken = localStorage.getItem("refreshToken");
			const response = await axios.post("/refresh_token", { refreshToken });

			if (response.status === 200) {
				const { accessToken } = response.data;
				localStorage.setItem("accessToken", accessToken);
				axiosInstance.defaults.headers.common[
					"Authorization"
				] = `Bearer ${accessToken}`;
				originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
				return axiosInstance(originalRequest);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
