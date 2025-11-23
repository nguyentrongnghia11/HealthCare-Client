import instance from '../utils/axiosInstance';


export interface CycleLog {
    id: string;
    startDate: string;
    endDate: string | null; 
    periodLength: number | null;
}


export interface CycleStatusResponse {
    user: any;
    summary: {
        currentPhase: string;
        isOvulationWindow: boolean;
        daysToNextPeriod: number;
        estimatedOvulationDate: string | null;
    };
    latestLog: CycleLog | null; 
    symptoms?: Array<any>;
}

export interface LogSymptomPayload {
    date: string; // ISO Date String
    symptomName: string;
    intensity: number; // 1-5
}

export interface LogPeriodPayload {
    startDate: string;    endDate?: string;
    flowIntensity?: number;
}


export const fetchCycleStatus = async (date?: string): Promise<CycleStatusResponse> => {
    console.log("Fetching cycle status for date: ", date);

    const params: Record<string, any> = {};
    if (date) params.date = date; 

    const res = await instance.get('/cycle/status', {
        params,
    });
    return res.data as CycleStatusResponse;
};


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


export const logPeriod = async (payload: LogPeriodPayload): Promise<CycleLog> => {
    console.log('Logging new period starting: ', payload.startDate);

    try {
        const res = await instance.post('/cycle/period', payload);
        console.log ("day la res ", res.data)
        return res.data.data as CycleLog; 
        
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