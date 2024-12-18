const base_url = 'http://localhost:3001/getProperties';

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