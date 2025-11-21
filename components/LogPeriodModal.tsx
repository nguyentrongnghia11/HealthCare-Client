import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Button,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface LogPeriodModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (startDate: Date, endDate?: Date) => void;
}

const LogPeriodModal: React.FC<LogPeriodModalProps> = ({
  visible,
  onDismiss,
  onSave,
}) => {
  const today = useMemo(() => new Date(), []);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);
  const [pickingFor, setPickingFor] = useState<"start" | "end">("start");

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS !== "ios") setShowPicker(false);
    if (!selectedDate) return;

    if (pickingFor === "start") {
      setStartDate(selectedDate);
      if (endDate && selectedDate > endDate) setEndDate(undefined);
    } else {
      // Không cho EndDate vượt quá ngày hiện tại
      setEndDate(selectedDate > today ? today : selectedDate);
    }
  };

  const minEndDate = pickingFor === "end" ? startDate : undefined;
  const pickerDate = pickingFor === "start" ? startDate : endDate || startDate;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Log Period Dates</Text>

          {/* Start Date */}
          <Text style={styles.label}>Start Date (Period started):</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => {
              setPickingFor("start");
              setShowPicker(true);
            }}
          >
            <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          {/* End Date */}
          <Text style={styles.label}>End Date (Period ended):</Text>
          <TouchableOpacity
            style={[
              styles.dateInput,
              endDate ? styles.dateInputActive : styles.dateInputInactive,
            ]}
            onPress={() => {
              setPickingFor("end");
              setShowPicker(true);
            }}
          >
            <Text style={styles.dateText}>
              {endDate ? endDate.toLocaleDateString() : "Set End Date (Optional)"}
            </Text>
          </TouchableOpacity>

          {/* Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={pickerDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={today}
              minimumDate={minEndDate}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <View style={styles.buttonWrap}>
              <Button title="Cancel" onPress={onDismiss} color="#6b7280" />
            </View>
            <View style={styles.buttonWrap}>
              <Button
                title="Save"
                onPress={() => onSave(startDate, endDate)}
                disabled={endDate ? endDate < startDate : false}
                color="#06b6d4"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogPeriodModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "85%",
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
    color: "#374151",
  },
  dateInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    backgroundColor: "#f9fafb",
    borderColor: "#d1d5db",
  },
  dateInputActive: {
    borderColor: "#06b6d4",
    backgroundColor: "#e0f7fa",
  },
  dateInputInactive: {
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  buttonWrap: {
    width: "48%",
    borderRadius: 8,
    overflow: "hidden",
  },
});
