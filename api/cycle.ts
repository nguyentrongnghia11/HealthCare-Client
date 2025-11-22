// src/api/cycle.ts
import instance from '../utils/axiosInstance'; // Giả định instance được import từ utils/axiosInstance

// --- INTERFACES ----------------------------------------------------

/**
 * Interface cho dữ liệu log kỳ kinh cá nhân (dùng trong phản hồi API).
 * Phản ánh CycleLogEntity/Schema ở backend.
 */
export interface CycleLog {
    id: string;
    startDate: string; // ISO Date String
    endDate: string | null; // ISO Date String
    periodLength: number | null;
}

/**
 * Interface cho dữ liệu trạng thái chu kỳ (GET /cycle/status).
 * Tương đương với CaloriesResponse (chứa user, summary).
 */
export interface CycleStatusResponse {
    user: any; // Thông tin người dùng
    summary: {
        currentPhase: string; // Tên giai đoạn hiện tại (ví dụ: 'Follicular', 'Luteal', 'Period')
        isOvulationWindow: boolean;
        daysToNextPeriod: number;
        estimatedOvulationDate: string | null; // ISO Date String
    };
    latestLog: CycleLog | null; // Kỳ kinh gần nhất
    symptoms?: Array<any>; // Triệu chứng đã ghi cho ngày hiện tại (Tùy chọn)
}

/**
 * Interface cho payload khi ghi lại triệu chứng (POST /cycle/symptom).
 */
export interface LogSymptomPayload {
    date: string; // ISO Date String
    symptomName: string;
    intensity: number; // 1-5
}

/**
 * Interface cho payload khi ghi lại kỳ kinh mới (POST /cycle/period).
 */
export interface LogPeriodPayload {
    startDate: string; // ISO Date String
    endDate?: string; // ISO Date String (Tùy chọn)
    flowIntensity?: number;
}


// --- API FUNCTIONS -------------------------------------------------

/**
 * @function fetchCycleStatus
 * Lấy trạng thái chu kỳ, dự đoán và lịch sử gần nhất cho một ngày cụ thể.
 * Tương đương với getCalories trong nutrition.ts.
 * Endpoint: GET /cycle/status
 * * @param date Ngày cần lấy trạng thái (ISO Date string, tùy chọn)
 * @returns Promise<CycleStatusResponse>
 */
export const fetchCycleStatus = async (date?: string): Promise<CycleStatusResponse> => {
    console.log("Fetching cycle status for date: ", date);

    const params: Record<string, any> = {};
    if (date) params.date = date; // Backend sẽ dùng date này để tính trạng thái

    const res = await instance.get('/cycle/status', {
        params,
    });
    // Giả định backend trả về dữ liệu đúng định dạng CycleStatusResponse
    return res.data as CycleStatusResponse;
};


/**
 * @function logSymptom
 * Ghi lại triệu chứng/tâm trạng hàng ngày.
 * Tương đương với uploadImage (vì đều là POST dữ liệu).
 * Endpoint: POST /cycle/symptom
 * * @param payload Dữ liệu triệu chứng chi tiết (tên, cường độ, ngày)
 * @returns Promise<any> (Phản hồi từ backend)
 */
export const logSymptom = async (payload: LogSymptomPayload) => {
    console.log('Logging symptom for date: ', payload.date);

    try {
        // Endpoint: POST /cycle/symptom
        const res = await instance.post('/cycle/symptom', payload);

        console.log('Response from logSymptom: ', res.data);

        if (res.data.data) {
            return res.data.data;
        }
        return res.data; // Trả về toàn bộ dữ liệu phản hồi nếu không có res.data.data

    } catch (error: unknown) {
        console.error('Lỗi khi log symptom: ', error);
        // Ném lỗi với thông báo chi tiết hơn
        throw new Error(`Failed to log symptom: ${error}`);
    }
};


/**
 * @function logPeriod
 * Ghi lại ngày bắt đầu kỳ kinh mới.
 * Endpoint: POST /cycle/period
 * * @param payload Dữ liệu kỳ kinh (startDate, endDate)
 * @returns Promise<CycleLog> (Bản ghi kỳ kinh mới được tạo)
 */
export const logPeriod = async (payload: LogPeriodPayload): Promise<CycleLog> => {
    console.log('Logging new period starting: ', payload.startDate);

    try {
        const res = await instance.post('/cycle/period', payload);
        return res.data.data as CycleLog; // Giả định backend trả về bản ghi CycleLog mới
        
    } catch (error: unknown) {
        console.error('Lỗi khi log period: ', error);
        throw new Error(`Failed to log period: ${error}`);
    }
}


export default {
    fetchCycleStatus,
    logSymptom,
    logPeriod,
};