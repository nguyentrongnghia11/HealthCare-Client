import { Feather } from "@expo/vector-icons";
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Danh sách triệu chứng mẫu
const SYMPTOMS = [
    { name: 'Cramps', icon: 'zap' },
    { name: 'Headache', icon: 'cloud-lightning' },
    { name: 'Fatigue', icon: 'droplet' },
    { name: 'Mood Swings', icon: 'meh' },
    { name: 'Bloating', icon: 'wind' },
    { name: 'Tender Breasts', icon: 'heart' },
    { name: 'Insomnia', icon: 'moon' },
];

interface LogSymptomModalProps {
    visible: boolean;
    onDismiss: () => void;
    // Hàm onSave nhận tên triệu chứng và cường độ
    onSave: (symptomName: string, intensity: number) => Promise<void>;
}

const LogSymptomModal: React.FC<LogSymptomModalProps> = ({ visible, onDismiss, onSave }) => {
    const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);
    const [intensity, setIntensity] = useState<number>(3); 
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!selectedSymptom) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất một triệu chứng.");
            return;
        }
        setIsSaving(true);
        try {
            // Gọi hàm onSave được truyền từ trang chính
            await onSave(selectedSymptom, intensity);
            // Không gọi onDismiss ở đây, onSave (trong trang chính) sẽ tự đóng sau khi thành công
        } catch (error) {
            // Lỗi đã được xử lý trong hàm onSave của trang chính
        } finally {
            setIsSaving(false);
            onDismiss(); // Đóng Modal bất kể thành công hay thất bại (để reset trạng thái)
        }
    };

    const renderIntensityButtons = () => {
        return [1, 2, 3, 4, 5].map(level => (
            <TouchableOpacity
                key={level}
                style={[
                    modalStyles.intensityButton,
                    intensity === level && modalStyles.intensityButtonActive,
                ]}
                onPress={() => setIntensity(level)}
            >
                <Text style={[modalStyles.intensityText, intensity === level && modalStyles.intensityTextActive]}>
                    {level}
                </Text>
            </TouchableOpacity>
        ));
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.title}>Share Your Symptoms</Text>
                    
                    <Text style={modalStyles.sectionLabel}>1. Select Symptom:</Text>
                    <ScrollView horizontal style={modalStyles.symptomScroll} showsHorizontalScrollIndicator={false}>
                        {SYMPTOMS.map((s) => (
                            <TouchableOpacity
                                key={s.name}
                                style={[
                                    modalStyles.symptomPill,
                                    selectedSymptom === s.name && modalStyles.symptomPillActive,
                                ]}
                                onPress={() => setSelectedSymptom(s.name)}
                            >
                                <Feather name={s.icon as any} size={14} color={selectedSymptom === s.name ? '#fff' : '#06b6d4'} />
                                <Text style={[modalStyles.symptomText, selectedSymptom === s.name && modalStyles.symptomTextActive]}>
                                    {s.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <Text style={modalStyles.sectionLabel}>2. Intensity (1-5):</Text>
                    <View style={modalStyles.intensityContainer}>
                        {renderIntensityButtons()}
                    </View>
                    <Text style={modalStyles.intensityHelperText}>
                        1 (Very Light) - 5 (Severe)
                    </Text>

                    <View style={modalStyles.buttonRow}>
                        <TouchableOpacity style={[modalStyles.actionButton, modalStyles.cancelButton]} onPress={onDismiss} disabled={isSaving}>
                            <Text style={[modalStyles.buttonText, { color: '#374151' }]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[modalStyles.actionButton, modalStyles.saveButton]} 
                            onPress={handleSave} 
                            disabled={isSaving || !selectedSymptom}
                        >
                            {isSaving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={modalStyles.buttonText}>Log Symptom</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 25,
        alignItems: "stretch",
        elevation: 8,
        width: '90%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#111827',
    },
    sectionLabel: {
        marginTop: 15,
        marginBottom: 10,
        fontWeight: '700',
        color: '#374151',
        fontSize: 16,
    },
    symptomScroll: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    symptomPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#06b6d4',
    },
    symptomPillActive: {
        backgroundColor: '#06b6d4',
    },
    symptomText: {
        marginLeft: 5,
        color: '#06b6d4',
        fontWeight: '600',
    },
    symptomTextActive: {
        color: '#fff',
    },
    intensityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 5,
    },
    intensityButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 2,
        borderColor: '#d1d5db',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    intensityButtonActive: {
        borderColor: '#f59e0b',
        backgroundColor: '#fef3c7',
    },
    intensityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6b7280',
    },
    intensityTextActive: {
        color: '#f59e0b',
    },
    intensityHelperText: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    actionButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    saveButton: {
        backgroundColor: '#06b6d4',
    },
    cancelButton: {
        backgroundColor: '#e5e7eb',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default LogSymptomModal;