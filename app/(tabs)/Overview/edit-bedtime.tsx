"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import back from '../../../assets/images/overview/back.png';
import { Link } from "expo-router"
interface EditBedtimeProps {
  initialBedtime?: string
  initialWakeup?: string
  onSave?: (bedtime: string, wakeup: string) => void
  onBack?: () => void
}

export default function EditBedtime({
  initialBedtime = "22:00",
  initialWakeup = "07:30",
  onSave,
  onBack,
}: EditBedtimeProps) {
  const [bedtimeHours, setBedtimeHours] = useState(Number.parseInt(initialBedtime.split(":")[0]))
  const [bedtimeMinutes, setBedtimeMinutes] = useState(Number.parseInt(initialBedtime.split(":")[1]))

  const [wakeupHours, setWakeupHours] = useState(Number.parseInt(initialWakeup.split(":")[0]))
  const [wakeupMinutes, setWakeupMinutes] = useState(Number.parseInt(initialWakeup.split(":")[1]))

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
      justifyContent: "space-between",
    },
    headerButton: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    section: {
      marginBottom: 32,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#666",
      marginBottom: 16,
    },
    timeDisplay: {
      backgroundColor: "#f9f9f9",
      borderRadius: 16,
      paddingVertical: 32,
      paddingHorizontal: 24,
      alignItems: "center",
      marginBottom: 24,
    },
    timeText: {
      fontSize: 48,
      fontWeight: "700",
      color: "#333",
      letterSpacing: 2,
    },
    timeLabel: {
      fontSize: 14,
      color: "#999",
      marginTop: 8,
      fontWeight: "500",
    },
    pickerRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      gap: 16,
    },
    pickerColumn: {
      flex: 1,
      alignItems: "center",
    },
    pickerLabel: {
      fontSize: 12,
      color: "#999",
      marginBottom: 12,
      fontWeight: "500",
    },
    pickerButtons: {
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
    },
    pickerBtn: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: "#e8e8e8",
      justifyContent: "center",
      alignItems: "center",
    },
    pickerBtnText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333",
    },
    pickerValue: {
      fontSize: 28,
      fontWeight: "700",
      color: "#333",
      minWidth: 60,
      textAlign: "center",
    },
    actionButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 32,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    cancelBtn: {
      backgroundColor: "#f0f0f0",
    },
    saveBtn: {
      backgroundColor: "#1abc9c",
    },
    buttonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    cancelBtnText: {
      color: "#333",
    },
    saveBtnText: {
      color: "#fff",
    },
  })

  const increaseBedtimeHours = () => setBedtimeHours((h) => (h + 1) % 24)
  const decreaseBedtimeHours = () => setBedtimeHours((h) => (h - 1 + 24) % 24)
  const increaseBedtimeMinutes = () => setBedtimeMinutes((m) => (m + 15) % 60)
  const decreaseBedtimeMinutes = () => setBedtimeMinutes((m) => (m - 15 + 60) % 60)

  const increaseWakeupHours = () => setWakeupHours((h) => (h + 1) % 24)
  const decreaseWakeupHours = () => setWakeupHours((h) => (h - 1 + 24) % 24)
  const increaseWakeupMinutes = () => setWakeupMinutes((m) => (m + 15) % 60)
  const decreaseWakeupMinutes = () => setWakeupMinutes((m) => (m - 15 + 60) % 60)

  const handleSave = () => {
    const formattedBedtime = `${String(bedtimeHours).padStart(2, "0")}:${String(bedtimeMinutes).padStart(2, "0")}`
    const formattedWakeup = `${String(wakeupHours).padStart(2, "0")}:${String(wakeupMinutes).padStart(2, "0")}`
    onSave?.(formattedBedtime, formattedWakeup)
  }

  const isBedtimePM = bedtimeHours >= 12
  const isWakeupAM = wakeupHours < 12

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="./" asChild>
            <TouchableOpacity style={styles.headerButton}>
              <Image source={back} style={styles.headerButton} />
            </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Set Schedule</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Bedtime Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bedtime</Text>

          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>
              {String(bedtimeHours).padStart(2, "0")}:{String(bedtimeMinutes).padStart(2, "0")}
            </Text>
            <Text style={styles.timeLabel}>{isBedtimePM ? "pm" : "am"}</Text>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hours</Text>
              <View style={styles.pickerButtons}>
                <TouchableOpacity style={styles.pickerBtn} onPress={increaseBedtimeHours}>
                  <Text style={styles.pickerBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{String(bedtimeHours).padStart(2, "0")}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={decreaseBedtimeHours}>
                  <Text style={styles.pickerBtnText}>−</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minutes</Text>
              <View style={styles.pickerButtons}>
                <TouchableOpacity style={styles.pickerBtn} onPress={increaseBedtimeMinutes}>
                  <Text style={styles.pickerBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{String(bedtimeMinutes).padStart(2, "0")}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={decreaseBedtimeMinutes}>
                  <Text style={styles.pickerBtnText}>−</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Wake-up Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Wake-up time</Text>

          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>
              {String(wakeupHours).padStart(2, "0")}:{String(wakeupMinutes).padStart(2, "0")}
            </Text>
            <Text style={styles.timeLabel}>{isWakeupAM ? "am" : "pm"}</Text>
          </View>

          <View style={styles.pickerRow}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hours</Text>
              <View style={styles.pickerButtons}>
                <TouchableOpacity style={styles.pickerBtn} onPress={increaseWakeupHours}>
                  <Text style={styles.pickerBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{String(wakeupHours).padStart(2, "0")}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={decreaseWakeupHours}>
                  <Text style={styles.pickerBtnText}>−</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minutes</Text>
              <View style={styles.pickerButtons}>
                <TouchableOpacity style={styles.pickerBtn} onPress={increaseWakeupMinutes}>
                  <Text style={styles.pickerBtnText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.pickerValue}>{String(wakeupMinutes).padStart(2, "0")}</Text>
                <TouchableOpacity style={styles.pickerBtn} onPress={decreaseWakeupMinutes}>
                  <Text style={styles.pickerBtnText}>−</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.button, styles.cancelBtn]} onPress={onBack}>
            <Text style={[styles.buttonText, styles.cancelBtnText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
            <Text style={[styles.buttonText, styles.saveBtnText]}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
