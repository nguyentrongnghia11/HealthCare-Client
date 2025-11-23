import instance from "../../utils/axiosInstance";

export const register = async (formData: any) => {
    try {
        const response = await instance.post('/otp', formData);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
        console.error('Lỗi khi register: ', errorMessage);
        throw new Error(errorMessage);
    }
}

export const verifyRegister = async (formData: any) => {
    console.log(formData);
    try {
        const response = await instance.post('/user', formData);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
        console.error('Lỗi khi verify: ', errorMessage);
        throw new Error(errorMessage);
    }
}

export const login = async (formData: any) => {
    console.log("day la form data ", formData);
    try {
        const response = await instance.post('/auth/login', formData);
        return response.data;
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định từ server';
        console.error('Lỗi khi login: ', errorMessage);
        throw new Error(errorMessage);
    }
}


export const loginGoogle = async (idToken: string) => {

    console.log ("day la token ", idToken)
    const res = await instance.post("/auth/google", { idToken});

    return res.data
}

export const loginFacebook = async (accessToken: string) => {

    console.log ("day la token ", accessToken)
    const res = await instance.post("/auth/facebook", {accessToken});
    return res.data
}

export const logout = async () => {
    try {
        // Optional: Call backend logout endpoint if exists
        // await instance.post('/auth/logout');
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return true; 
    }
}



