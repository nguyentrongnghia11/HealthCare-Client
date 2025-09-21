import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export default function ThisWeekReport() {
  const reportData = [
    {
      id: 1,
      icon: "👟",
      title: "Steps",
      value: "697,978",
    },
    {
      id: 2,
      icon: "💪",
      title: "Workout",
      value: "6h 45min",
    },
    {
      id: 3,
      icon: "💧",
      title: "Water",
      value: "10,659 ml",
    },
    {
      id: 4,
      icon: "😴",
      title: "Sleep",
      value: "29h 17min",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>This week report</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>View more →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {reportData.map((item) => (
          <View key={item.id} style={styles.reportItem}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{item.icon}</Text>
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        ))}
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
    color: "#000000",
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