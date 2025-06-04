import axios from "axios";

const base_url = import.meta.env.VITE_REACT_APP_API_BASE_URL;
const single_property_url = (id) => `${base_url}/getSingleProperty/${id}`;

export const getAll = async (username) => {
    try {
        const response = await fetch(`${base_url}/getProperties?created_by=${username}`);
        
        // Проверка дали отговорът е успешен
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const data = Object.values(result);

        return data;
    } catch (error) {
        console.log('Error fetching properties:', error);
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

export const createProperty = async (propertyData) => {
    try {
      const response = await axios.post(`${base_url}/createProperty`, propertyData);
      return response.data;
    } catch (error) {
      console.error("Error while creating property", error);
      throw error;
    }
  };

export const updateProperty = async (id, data) => {
    return axios.put(`${base_url}/updateProperty/${id}`, data)
        .then(response => response.data)
        .catch(error => {
            console.error('Error updating query: ', error );
            throw error;
        });
}

export const updateResident = (propertyId, { residentNumber }) => {
    return axios.put(`${base_url}/updateResident/${propertyId}`, {
      residentNumber
    })
    .then(response => response.data) // Връща данните от отговора, които могат да се използват във фронтенда
    .catch(error => {
      console.error("Error updating resident:", error);
      throw error; // Прехвърля грешката, за да може фронтендът да я обработи
    });
  };

export const deleteProperty = async (id) => {
    try {
        const response = await axios.delete(`${base_url}/deleteProperty/${id}`);
        return response.data;  // Return the response data
    } catch (error) {
        console.error('Error deleting property:', error);
        throw error;  // Rethrow error for further handling
    }
}

export const getAddressesPerUser = async (username) => {
    try {
        const response = await fetch(`${base_url}/getAllPropertiesPerUser?created_by=${username}`);
        if (!response.ok) {
            throw new Error('Failed to fetch addresses');
        }
        const result = await response.json();
        return result;  // Assuming result is already an array
    } catch (error) {
        console.log(error);
        return [];  // Return an empty array if there's an error
    }
}

