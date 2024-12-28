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