import axios from "../axios";

const createAddress = async (addressData) => {
    try {
        
        const response = await axios.post('/user/addresses', addressData);
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

const getAddresses = async () => {
    try {
        
        const response = await axios.get('/user/addresses');
        return response.data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

export { createAddress, getAddresses };