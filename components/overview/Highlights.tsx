import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export default function Highlights() {
  const highlightData = [
    {
      id: 1,
      title: "Steps",
      value: "11,857",
      subtitle: "updated 15 min ago",
      backgroundColor: "#00BFFF",
      icon: "🏃‍♂️",
    },
    {
      id: 2,
      title: "Cycle tracking",
      value: "12",
      subtitle: "days before period",
      updateText: "updated 30m ago",
      backgroundColor: "#FF6B6B",
      icon: "📅",
    },
    {
      id: 3,
      title: "Sleep",
      value: "7h 31min",
      subtitle: "updated a day ago",
      backgroundColor: "#2C3E50",
      icon: "🌙",
    },
    {
      id: 4,
      title: "Nutrition",
      value: "960",
      subtitle: "kcal",
      updateText: "updated 5 min ago",
      backgroundColor: "#FF8C00",
      icon: "🥤",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Highlights</Text>
        <TouchableOpacity>
          <Text style={styles.viewMore}>View more →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {highlightData.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.card, { backgroundColor: item.backgroundColor }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardValue}>{item.value}</Text>
            <Text style={styles.cardSubtitle}>
              {item.subtitle}
              {item.updateText && `\n${item.updateText}`}
            </Text>
          </TouchableOpacity>
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
  card: {
    width: "48%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    minHeight: 140,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 24,
    color: "#ffffff",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 16,
  },
})
