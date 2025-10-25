



interface UploadResponse {
    message?: string;
    data?: any;
}
export const register = async (formData: any) => {
    const serverUrl = 'http://10.234.168.160:3000/otp';

    try {
        const response: Response = await fetch(serverUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const responseData: UploadResponse = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message || 'Lỗi không xác định từ server');
        }
    } catch (error: unknown) {
        let errorMessage = 'Đã xảy ra lỗi không xác định';

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error('Lỗi khi upload: ', errorMessage);
        throw new Error(errorMessage);
    }
}

export const verifyRegister = async (formData: any) => {
    const serverUrl = 'http://10.234.168.160:3000/user';

    try {
        const response: Response = await fetch(serverUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const responseData: UploadResponse = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message || 'Lỗi không xác định từ server');
        }
    } catch (error: unknown) {
        let errorMessage = 'Đã xảy ra lỗi không xác định';

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error('Lỗi khi upload: ', errorMessage);
        throw new Error(errorMessage);
    }
}

export const login = async (formData: any) => {
    const serverUrl = 'http://10.234.168.160:3000/auth/login';


    //     {
    //   "identifier": "trongnghia599",
    //   "password": "trongnghia599"
    // }

    console.log ("day la form data ", formData)

    try {
        const response: Response = await fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                 'Content-Type': 'application/json',
            },
        });

        const responseData: UploadResponse = await response.json();

        if (response.ok) {
            return responseData;
        } else {
            throw new Error(responseData.message || 'Lỗi không xác định từ server');
        }
    } catch (error: unknown) {
        let errorMessage = 'Đã xảy ra lỗi không xác định';

        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error('Lỗi khi upload: ', errorMessage);
        throw new Error(errorMessage);
    }
}



