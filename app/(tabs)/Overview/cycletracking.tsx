import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// Vui lòng đảm bảo các đường dẫn import dưới đây là chính xác trong cấu trúc dự án của bạn
import { CycleStatusResponse, fetchCycleStatus, logPeriod, LogPeriodPayload, logSymptom, LogSymptomPayload } from '../../../api/cycle';
import CalendarPicker from "../../../components/CalendarPicker";
import LogPeriodModal from "../../../components/LogPeriodModal";
import LogSymptomModal from "../../../components/LogSymptomModal";
// =========================================================================
// MOCK/HELPER LOGIC
// =========================================================================

const AVERAGE_CYCLE_LENGTH = 28;
const LUTEAL_PHASE_LENGTH = 14; 

interface CycleStatus {
    statusText: string;
    noteText: string;
    isPeriod: boolean;
    isOvulationWindow: boolean;
    nextPeriodStartDate: Date | null;
    ovulationDate: Date | null;
}

/**
 * Tính toán trạng thái chu kỳ dựa trên ngày được chọn và lịch sử.
 */
const getCycleStatus = (selectedDate: Date, lastPeriodStartDate: Date): CycleStatus => {
    
    const nextPeriodStartDate = new Date(lastPeriodStartDate);
    nextPeriodStartDate.setDate(nextPeriodStartDate.getDate() + AVERAGE_CYCLE_LENGTH);

    const diffTime = nextPeriodStartDate.getTime() - selectedDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const ovulationDate = new Date(nextPeriodStartDate);
    ovulationDate.setDate(ovulationDate.getDate() - LUTEAL_PHASE_LENGTH);
    const diffToOvulation = Math.ceil((ovulationDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));

    let statusText = "";
    let noteText = "";
    let isPeriod = false;
    let isOvulationWindow = false;

    if (diffDays <= 5 && diffDays > 0) {
        statusText = `Day ${5 - diffDays + 1} of Period`;
        noteText = "You are on your period (estimated)";
        isPeriod = true;
    } else if (diffToOvulation >= -2 && diffToOvulation <= 3) {
        statusText = `Ovulation in ${diffToOvulation} days`;
        noteText = "HIGH chance of getting pregnant (Fertile Window)";
        isOvulationWindow = true;
    } else if (diffDays > 0) {
        statusText = `Period in ${diffDays} days`;
        noteText = "Low chance of getting pregnant";
    } else {
        statusText = `Period is overdue by ${Math.abs(diffDays)} days`;
        noteText = "Please log your last period or check settings.";
    }
    
    return {
        statusText,
        noteText,
        isPeriod,
        isOvulationWindow,
        nextPeriodStartDate,
        ovulationDate
    };
};

// =========================================================================
// COMPONENT
// =========================================================================

export default function CycleTrackingPage() {
    const router = useRouter()
    const [selectedDate, setSelectedDate] = useState(new Date())
    
    // Khôi phục States quản lý Modal
    const [isPeriodModalVisible, setIsPeriodModalVisible] = useState(false);
    const [isSymptomModalVisible, setIsSymptomModalVisible] = useState(false); 
    
    // States dữ liệu
    const [lastPeriodStartDate, setLastPeriodStartDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(true) // LOADING IS TRUE INITIALLY
    const [symptomsLog, setSymptomsLog] = useState<string[]>([]) 

    // Hàm refresh data chính
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Đây là nơi chờ đợi kết quả từ API, gây ra độ trễ.
            const statusResponse: CycleStatusResponse = await fetchCycleStatus(selectedDate.toISOString().split('T')[0]);
            
            if (statusResponse && statusResponse.latestLog && statusResponse.latestLog.startDate) {
                setLastPeriodStartDate(new Date(statusResponse.latestLog.startDate));
            } else {
                setLastPeriodStartDate(null);
            }
        } catch (error) {
            console.error("Failed to fetch cycle status:", error);
        } finally {
            setLoading(false); // UI chính chỉ render sau khi hàm này kết thúc
        }
    }, [selectedDate]);

    // Chạy fetch data khi component load hoặc ngày được chọn thay đổi
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Logic tính toán trạng thái chu kỳ
    const cycleStatus = useMemo(() => {
        if (!lastPeriodStartDate) {
            return {
                statusText: "Waiting for history log",
                noteText: "Please log your first period date.",
                isPeriod: false,
                isOvulationWindow: false,
                nextPeriodStartDate: null,
                ovulationDate: null,
            } as CycleStatus
        }
        return getCycleStatus(selectedDate, lastPeriodStartDate)
    }, [selectedDate, lastPeriodStartDate])


    // ------------------------------------
    // CHỨC NĂNG 1: LOG PERIOD (Nhập ngày kinh)
    // ------------------------------------
    const handleLogPeriod = useCallback(async (startDate: Date, endDate?: Date) => {
        setIsPeriodModalVisible(false); // Đóng Modal ngay lập tức

        const payload: LogPeriodPayload = {
            startDate: startDate.toISOString(),
            endDate: endDate ? endDate.toISOString() : undefined,
        };

        try {
            // LƯU Ý: Đảm bảo path của file 'api/cycle' là chính xác.
            await logPeriod(payload);
            setLastPeriodStartDate(startDate); // Cập nhật trạng thái hiển thị
            Alert.alert("Thành công", "Đã lưu ngày kỳ kinh mới!");

        } catch (error) {
            Alert.alert("Lỗi", "Không thể lưu ngày kỳ kinh. Vui lòng kiểm tra API.");
        }
    }, []);

    const handleEditPeriodDates = useCallback(() => {
        setIsPeriodModalVisible(true); // Mở Modal
    }, []);


    // ------------------------------------
    // CHỨC NĂNG 2: LOG SYMPTOM (Ghi Triệu chứng)
    // ------------------------------------
    const handleLogSymptomSave = useCallback(async (symptomName: string, intensity: number) => {
        // Hàm này được gọi từ Modal
        
        const payload: LogSymptomPayload = {
            symptomName,
            intensity,
            date: selectedDate.toISOString(),
        };

        // LƯU Ý: Đảm bảo path của file 'api/cycle' là chính xác.
        const success = await logSymptom(payload);

        if (success) {
            const displaySymptom = `${symptomName} (I: ${intensity})`;
            // Cập nhật log cục bộ (ví dụ: để hiển thị trong Insights)
            setSymptomsLog(prev => [...prev, displaySymptom]); 
            Alert.alert("Success", `Logged: ${symptomName}`);
        } else {
            Alert.alert("Error", "Failed to log symptom.");
        }
        // Modal sẽ tự đóng trong LogSymptomModal
    }, [selectedDate]);

    const handleShareSymptoms = useCallback(() => {
        setIsSymptomModalVisible(true); // Mở Modal
    }, []);

    // ------------------------------------
    // CHỨC NĂNG 3: VIEW INSIGHTS
    // ------------------------------------
    const handleViewDailyInsights = useCallback(() => {
        Alert.alert(
            "Daily Health Summary",
            `Date: ${selectedDate.toDateString()}\nPhase: ${cycleStatus.statusText}\n\nLocal Logged Symptoms: ${symptomsLog.join(", ") || "None"}`
        )
    }, [selectedDate, cycleStatus, symptomsLog])


    // Định kiểu màu động
    const circleColor = cycleStatus.isPeriod
        ? "#ef4444" // Đỏ cho Kinh nguyệt
        : cycleStatus.isOvulationWindow
            ? "#f59e0b" // Vàng cho Rụng trứng
            : "#06b6d4" // Xanh dương cho giai đoạn khác

    // Component Render
    return (
        <ScrollView style={styles.container}>

            {/* Calendar */}
            {/* LƯU Ý: Đảm bảo path của component CalendarPicker là chính xác. */}
            <CalendarPicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

            {/* Period Circle */}
            <View style={styles.center}>
                {loading ? (
                    <View style={styles.periodCirclePlaceholder}>
                        <ActivityIndicator size="large" color="#06b6d4" />
                        <Text style={styles.loadingText}>Loading cycle data...</Text>
                    </View>
                ) : (
                    <View style={[styles.periodCircle, { backgroundColor: circleColor }]}>
                        <Text style={styles.periodLabel}>Current Status</Text>
                        <Text style={styles.periodValue}>{cycleStatus.statusText}</Text>
                        <Text style={styles.periodNote}>{cycleStatus.noteText}</Text>
                        <TouchableOpacity style={styles.editButton} onPress={handleEditPeriodDates}>
                            <Text style={styles.editButtonText}>Edit period dates</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            
            {/* Cycle Overview */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Cycle Overview</Text>
                <View style={styles.row}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Last Period</Text>
                        <Text style={styles.infoValue}>
                            {lastPeriodStartDate ? lastPeriodStartDate.toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>Next Period (Est.)</Text>
                        <Text style={styles.infoValue}>
                            {cycleStatus.nextPeriodStartDate ? cycleStatus.nextPeriodStartDate.toLocaleDateString() : 'N/A'}
                        </Text>
                    </View>
                </View>
                <View style={styles.infoCardFull}>
                    <Text style={styles.infoLabel}>Estimated Ovulation Day</Text>
                    <Text style={styles.infoValue}>
                        {cycleStatus.ovulationDate ? cycleStatus.ovulationDate.toLocaleDateString() : 'N/A'}
                    </Text>
                </View>
            </View>

            {/* How are you feeling (Triệu chứng) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How are you feeling today?</Text>
                <View style={styles.row}>
                    {/* Share Symptoms - Mở Modal */}
                    <TouchableOpacity style={styles.card} onPress={handleShareSymptoms}>
                        <Feather name="file-text" size={32} color="#06b6d4" style={{ marginBottom: 8 }} />
                        <Text style={styles.cardText}>Share your symptoms with us</Text>
                    </TouchableOpacity>
                    {/* Daily Insights */}
                    <TouchableOpacity style={styles.card} onPress={handleViewDailyInsights}>
                        <Feather name="bar-chart-2" size={32} color="#a855f7" style={{ marginBottom: 8 }} />
                        <Text style={styles.cardText}>Here's your daily insights</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Menstrual health */}
            {/* Vui lòng bỏ comment (uncomment) phần này nếu bạn muốn hiển thị lại, đảm bảo đã import 'Image' từ react-native */}
            {/*
            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <Text style={styles.sectionTitle}>Menstrual health</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMore}>View more</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <View style={styles.healthCard}>
                        <Image
                            source={{ uri: "https://placehold.co/400x150/06b6d4/ffffff?text=Cravings" }}
                            style={styles.image}
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        />
                        <Text style={styles.healthText}>
                            Craving sweets on your period? Here's why & what to do about it
                        </Text>
                    </View>

                    <View style={styles.healthCard}>
                          <Image
                            source={{ uri: "https://placehold.co/400x150/a855f7/ffffff?text=BirthControl" }}
                            style={styles.image}
                            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        />
                        <Text style={styles.healthText}>
                            Is birth control bad for your menstrual health?
                        </Text>
                    </View>
                </View>
            </View>
            */}


            {/* ------------------------------------ */}
            {/* MODALS */}
            {/* ------------------------------------ */}
            
            {/* Modal Nhập ngày kinh */}
            {isPeriodModalVisible && (
                <LogPeriodModal 
                    visible={isPeriodModalVisible}
                    onDismiss={() => setIsPeriodModalVisible(false)}
                    onSave={handleLogPeriod} 
                />
            )}

            {/* Modal Ghi triệu chứng */}
            {isSymptomModalVisible && (
                <LogSymptomModal 
                    visible={isSymptomModalVisible}
                    onDismiss={() => setIsSymptomModalVisible(false)}
                    onSave={handleLogSymptomSave}
                />
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
    center: { alignItems: "center", marginBottom: 24 },
    separator: {
        height: 1,
        backgroundColor: "#e5e7eb",
        marginVertical: 16,
        marginHorizontal: -16, 
    },

    periodCircle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    periodCirclePlaceholder: { 
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    loadingText: {
        marginTop: 8,
        color: "#6b7280",
        fontWeight: '600'
    },

    periodLabel: { color: "#fff", fontSize: 16, marginBottom: 4 },
    periodValue: { color: "#fff", fontSize: 28, fontWeight: "bold", marginBottom: 4, textAlign: 'center' },
    periodNote: { color: "#fff", opacity: 0.9, fontSize: 13, marginBottom: 16, textAlign: "center" },
    editButton: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    editButtonText: { color: "#fff", fontSize: 13 },

    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111", marginBottom: 16 },

    row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },

    card: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        minHeight: 120, // Đảm bảo chiều cao tối thiểu
    },
    cardText: { color: "#374151", fontSize: 14, textAlign: "center", fontWeight: "500", marginTop: 8 },

    healthCard: { flex: 1, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", elevation: 2 },
    image: { width: "100%", height: 100, resizeMode: "cover" },
    healthText: { fontSize: 13, color: "#374151", padding: 8, fontWeight: "400" },
    viewMore: { color: "#06b6d4", fontWeight: "600", fontSize: 14 },
    
    // Thẻ Thông tin mới
    infoCard: {
        flex: 1,
        backgroundColor: "#e0f7fa", 
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        borderLeftWidth: 4,
        borderLeftColor: "#06b6d4",
    },
    infoCardFull: {
        backgroundColor: "#fef3c7", 
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        marginTop: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
    },
    infoLabel: {
        fontSize: 13,
        color: "#6b7280",
        marginBottom: 4,
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 16,
        color: "#1f2937",
        fontWeight: "700",
    }
})