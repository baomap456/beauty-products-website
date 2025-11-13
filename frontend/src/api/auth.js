import axios from "./axios";

const login = async (data) => {
    try {
        const response = await axios.post("/login",data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post("/register", userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getProfile = async () => {
    try {
        const response = await axios.get("/profile");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export {
    login,
    register,
    getProfile,
};
