import axios from "axios";

const base_url = 'http://localhost:3001/api';

export const createAddress = async (propertyData) => {
    try {
        const response = await axios.post(`${base_url}/createAddress`, propertyData);
        return response.data;
    } catch (error) {
        console.error("Error while creating address", error);
        throw error;
    }
};