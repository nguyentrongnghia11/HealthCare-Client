import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CycleTrackingPage() {
  const router = useRouter();

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const dates = ["06", "07", "08", "09", "10", "11", "12"];
  const todayIndex = 5; // Index for day 11

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle tracking</Text>
        <View style={{ width: 28 }} /> 
      </View>

      {/* Calendar */}
      <View style={styles.calendar}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayContainer}>
            <Text style={styles.dayText}>{day}</Text>
            <View
              style={[
                styles.dateCircle,
                index === todayIndex && styles.todayCircle,
              ]}
            >
              <Text
                style={[
                  styles.dateText,
                  index === todayIndex && styles.todayText,
                ]}
              >
                {dates[index]}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Period Circle */}
      <View style={styles.center}>
        <View style={styles.periodCircle}>
          <Text style={styles.periodLabel}>Period in</Text>
          <Text style={styles.periodValue}>12 days</Text>
          <Text style={styles.periodNote}>Low chance of getting pregnant</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit period dates</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* How are you feeling */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling today?</Text>
        <View style={styles.row}>
          <View style={styles.card}>
            <Feather name="file-text" size={32} color="#06b6d4" style={{ marginBottom: 8 }} />
            <Text style={styles.cardText}>Share your symptoms with us</Text>
          </View>
          <View style={styles.card}>
            <Feather name="bar-chart-2" size={32} color="#a855f7" style={{ marginBottom: 8 }} />
            <Text style={styles.cardText}>Here's your daily insights</Text>
          </View>
        </View>
      </View>

      {/* Menstrual health */}
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
              source={require("../../../assets/images/adaptive-icon.png")}
              style={styles.image}
            />
            <Text style={styles.healthText}>
              Craving sweets on your period? Here's why & what to do about it
            </Text>
          </View>

          <View style={styles.healthCard}>
            <Image
              source={require("../../../assets/images/adaptive-icon.png")}
              style={styles.image}
            />
            <Text style={styles.healthText}>
              Is birth control bad for your menstrual health?
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#111" },
  calendar: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  dayContainer: { alignItems: "center" },
  dayText: { color: "#6b7280", fontSize: 13, marginBottom: 6 },
  dateCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  todayCircle: { backgroundColor: "#06b6d4" },
  dateText: { color: "#374151", fontWeight: "500" },
  todayText: { color: "#fff" },
  center: { alignItems: "center", marginBottom: 24 },
  periodCircle: {
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: "#06b6d4", alignItems: "center", justifyContent: "center",
    padding: 16,
  },
  periodLabel: { color: "#fff", fontSize: 16, marginBottom: 4 },
  periodValue: { color: "#fff", fontSize: 32, fontWeight: "bold", marginBottom: 4 },
  periodNote: { color: "#fff", opacity: 0.9, fontSize: 13, marginBottom: 16, textAlign: "center" },
  editButton: { borderWidth: 1, borderColor: "#fff", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 20 },
  editButtonText: { color: "#fff", fontSize: 13 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#111", marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 16, padding: 12, alignItems: "center", elevation: 2 },
  cardText: { color: "#374151", fontSize: 13, textAlign: "center" },
  healthCard: { flex: 1, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", elevation: 2 },
  image: { width: "100%", height: 100, resizeMode: "cover" },
  healthText: { fontSize: 12, color: "#374151", padding: 8 },
  viewMore: { color: "#06b6d4", fontWeight: "500", fontSize: 13 },
});
