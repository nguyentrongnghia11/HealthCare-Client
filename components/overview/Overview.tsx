import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Link } from "expo-router"

export default function Overview() {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>☀️ TUES 11 JUL</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Overview</Text>
        <Link href="/(tabs)/Overview/alldata" asChild>
        <TouchableOpacity style={styles.allDataButton}>
          <Text style={styles.allDataText}>📊 All data</Text>
        </TouchableOpacity>
      </Link>
      </View>

      <View style={styles.healthScoreCard}>
        <View style={styles.cardContent}>
          <View style={styles.textSection}>
            <Text style={styles.cardTitle}>Health Score</Text>
            <Text style={styles.cardDescription}>
              Based on your overview health tracking, your score is 78 and consider good..
            </Text>
            <TouchableOpacity>
              <Text style={styles.tellMeMore}>Tell me more →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scoreSection}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>78</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  dateContainer: {
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  allDataButton: {
    backgroundColor: "#E8F8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#00BFFF",
  },
  allDataText: {
    color: "#00BFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  healthScoreCard: {
    backgroundColor: "#F0F8F0",
    borderRadius: 16,
    padding: 20,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    marginRight: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 12,
  },
  tellMeMore: {
    fontSize: 14,
    color: "#00BFFF",
    fontWeight: "500",
  },
  scoreSection: {
    alignItems: "center",
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
})
