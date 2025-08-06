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

export const monthlyExpensesForProperty = async (monthlyExpenses) => {
    try {
        const response = await axios.post(`${base_url}/monthlyExpensesForSingleProperty`, monthlyExpenses);
        return response.data
    } catch (error) {
        console.error('Error while saving expenses for a singe property', error);
        throw error;
    }
}

export const getChargesByMonthAndYear = async ({ address_id, charge_month, charge_year }) => {
    try {
        const response = await axios.get(`${base_url}/reports`, {
            params: { address_id, charge_month, charge_year }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching charges", error);
        throw error;
    }
};

export const getExpensessesForAddress = async (addressId) => {
    try {
        const response = await axios.get(`${base_url}/expensessesForAddresss?address=${addressId}`);
        return response.data;
    } catch (error) {
        console.error("Error while fetching expenses", error);
        throw error;
    }
};
