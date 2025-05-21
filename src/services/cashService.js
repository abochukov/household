import axios from "axios";

const base_url = 'http://localhost:3001/api';

export const getAllResidentsForAddress = async (username, address) => {
    try {
        const response = await axios.get(`${base_url}/allResidentsForAddress?username=${username}&address=${address}`);
        return response.data;  // Assuming it returns an array of addresses
    } catch (error) {
        console.error("Error while fetching addresses", error);
        throw error;
    }
};

export const expensessesForAddress = async (expensesData) => {
    try {
        const response = await axios.post(`${base_url}/expensessesForAddress`, expensesData);
        return response.data;
    } catch (error) {
        console.error("Error while creating address", error);
        throw error;
    }
};