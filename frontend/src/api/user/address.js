import axios from "../axios";

const createAddress = async (addressData) => {
    try {
        // Đường dẫn này phải KHỚP với backend
        const response = await axios.post('/user/addresses', addressData);
        return response.data;
    } catch (error) {
        console.error("API Error:", error); // Log lỗi thật ra để dễ debug
        throw error;
    }
}

const getAddresses = async () => {
    try {
        // Đường dẫn này phải KHỚP với backend
        const response = await axios.get('/user/addresses');
        return response.data;
    } catch (error) {
        console.error("API Error:", error); // Log lỗi thật ra để dễ debug
        throw error;
    }
}

export { createAddress, getAddresses };