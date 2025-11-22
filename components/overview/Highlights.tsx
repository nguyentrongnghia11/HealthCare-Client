import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getCalories } from "../../api/nutrition"
import { getTodayRunningData } from "../../api/running"

export default function Highlights() {
  const router = useRouter()
  
  // State for dynamic data
  const [nutritionCalories, setNutritionCalories] = useState(0)
  const [runningKm, setRunningKm] = useState(0)
  
  // Fetch nutrition data
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
        const data = await getCalories(today)
        
        // Calculate total calories from meals
        const totalCals = data.meals?.reduce((sum, meal) => {
          return sum + (meal.calories || 0)
        }, 0) || 0
        
        setNutritionCalories(Math.round(totalCals))
      } catch (error) {
        console.error('Failed to fetch nutrition data:', error)
      }
    }
    
    fetchNutritionData()
  }, [])
  
  // Fetch running data
  useEffect(() => {
    const fetchRunningData = async () => {
      try {
        const data = await getTodayRunningData()
        const totalKm = data.summary?.totalDistanceKm || 0
        setRunningKm(totalKm)
      } catch (error) {
        console.error('Failed to fetch running data:', error)
      }
    }
    
    fetchRunningData()
  }, [])

  const handlePress = (item: any) => {
    if (item.title === "Sleep") {
      router.push("/Overview/sleep")
    }
     if (item.title === "Cycle tracking") {
      router.push("/Overview/cycletracking")
    }
  }
  
  const highlightData = [
    {
      id: 1,
      title: "Steps",
      value: runningKm.toFixed(2),
      subtitle: "km today",
      backgroundColor: "#00BFFF",
      icon: "🏃‍♂️",
      link: "/(tabs)/Explore/step_stracker",
    },
    {
      id: 2,
      title: "Cycle tracking",
      value: "12",
      subtitle: "days before period",
      updateText: "updated 30m ago",
      backgroundColor: "#FF6B6B",
      icon: "📅",
      link: "/(tabs)/Overview/cycletracking",
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
      value: nutritionCalories.toString(),
      subtitle: "kcal consumed",
      updateText: "today",
      backgroundColor: "#FF8C00",
      icon: "🥤",
      link: "/(tabs)/Explore/nutrition",
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
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.backgroundColor }]}
            onPress={() => handlePress(item)}
            activeOpacity={0.7}
          >
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
