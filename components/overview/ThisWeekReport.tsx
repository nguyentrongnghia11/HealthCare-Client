import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export default function ThisWeekReport() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>This week report</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>View more →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View key={1} style={styles.reportItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👟</Text>
            <Text style={styles.itemTitle}>Steps</Text>
          </View>
          <Text style={styles.itemValue}>697,978</Text>
        </View>

        <View key={2} style={styles.reportItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>💪</Text>
              <Text style={styles.itemTitle}>Workout</Text>
            </View>
            <Text style={styles.itemValue}>6h 45min</Text>
          </View>

          <View key={3} style={styles.reportItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>💧</Text>
              <Text style={styles.itemTitle}>Water</Text>
            </View>
            <Text style={styles.itemValue}>10,659 ml</Text>
          </View>

          <View key={4} style={styles.reportItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>😴</Text>
              <Text style={styles.itemTitle}>Sleep</Text>
            </View>
            <Text style={styles.itemValue}>29h 17min</Text>
          </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27b315",
  },
  viewMore: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  reportItem: {
    width: "48%",
    marginBottom: 20,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: "#27b315",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  itemValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
})