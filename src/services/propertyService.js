import axios from "axios";

const base_url = 'http://localhost:3001/getProperties';
const single_property_url = (id) => `http://localhost:3001/getSingleProperty/${id}`;

export const getAll = async () => {
    try {
        const response = await fetch(base_url);
        const result = await response.json();
        const data = Object.values(result);

        return data;
    } catch {
        console.log(error)
    }
}

export const singleProperty = async (id) => {
    try {
        const response = await fetch(single_property_url(id));
        const result = await response.json();
        const data = Object.values(result);

        return data;
    } catch {
        console.log(error)
    }
}

export const updateProperty = async (id, data) => {
    return axios.put(`http://localhost:3001/updateProperty/${id}`, data)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating query: ', error );
            throw error;
        });
}

export const deleteProperty = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3001/deleteProperty/${id}`);
        return response.data;  // Return the response data
    } catch (error) {
        console.error('Error deleting property:', error);
        throw error;  // Rethrow error for further handling
    }
}