import axios from "axios";

// const base_url = import.meta.env.VITE_REACT_APP_API_BASE_URL;
const isProd = import.meta.env.MODE === 'production';
const base_url = isProd
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_LOCAL;


export const getUser = async (username) => {
    try {
        const response = await axios.get(`${base_url}/user?username=${username}`);
        return response.data;  // Assuming it returns an array of addresses
    } catch (error) {
        console.error("Error while fetching addresses", error);
        throw error;
    }
};
