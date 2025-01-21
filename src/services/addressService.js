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

export const getAddresses = async (username) => {
    try {
        const response = await axios.get(`${base_url}/addressesForUser?username=${username}`);
        return response.data;  // Assuming it returns an array of addresses
    } catch (error) {
        console.error("Error while fetching addresses", error);
        throw error;
    }
};

export const updateAddress = async (id, data) => {
    return axios.put(`${base_url}/updateAddress/${id}`, data)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating query: ', error );
            throw error;
        });
}

export const deleteAddress = async(id) => {
    try {
        const response = await axios.delete(`${base_url}/deleteAddress/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting address', error);
        throw error;
    }
}