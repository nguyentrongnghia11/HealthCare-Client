import { useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getTodaySummary, TodaySummary } from "../../api/overview"

export default function Highlights() {
  const router = useRouter()
  
  // State for dynamic data
  const [todaySummary, setTodaySummary] = useState<TodaySummary | null>(null)
  
  // Fetch today's summary data
  const fetchTodaySummary = useCallback(async () => {
    try {
      const data = await getTodaySummary()
      setTodaySummary(data)
    } catch (error) {
      console.error('Failed to fetch today summary:', error)
    }
  }, [])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTodaySummary()
    }, [fetchTodaySummary])
  )

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  const calculateSleepDuration = (bedtime: string, wakeup: string) => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number)
    const [wakeHour, wakeMin] = wakeup.split(':').map(Number)
    
    let bedTimeInMinutes = bedHour * 60 + bedMin
    let wakeTimeInMinutes = wakeHour * 60 + wakeMin
    
    // If wakeup time is earlier than bedtime, it means next day
    if (wakeTimeInMinutes < bedTimeInMinutes) {
      wakeTimeInMinutes += 24 * 60
    }
    
    const totalMinutes = wakeTimeInMinutes - bedTimeInMinutes
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    
    return `${hours}h ${mins}min`
  }

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
      value: todaySummary?.distanceKm.toFixed(2) || "0",
      subtitle: "km today",
      backgroundColor: "#00BFFF",
      icon: "🏃‍♂️",
      link: "/(tabs)/Explore/step_stracker",
    },
    {
      id: 2,
      title: "Cycle tracking",
      value: todaySummary?.cycle.daysUntilNextPeriod.toString() || "0",
      subtitle: "days before period",
      updateText: `${todaySummary?.cycle.phase || 'unknown'}`,
      backgroundColor: "#FF6B6B",
      icon: "📅",
      link: "/(tabs)/Overview/cycletracking",
    },
    {
      id: 3,
      title: "Sleep",
      value: todaySummary?.sleep.bedtime && todaySummary?.sleep.wakeup 
        ? calculateSleepDuration(todaySummary.sleep.bedtime, todaySummary.sleep.wakeup)
        : "0h 0min",
      subtitle: todaySummary?.sleep.wakeup ? `wake up at ${todaySummary.sleep.wakeup}` : "no data",
      backgroundColor: "#2C3E50",
      icon: "🌙",
    },
    {
      id: 4,
      title: "Nutrition",
      value: todaySummary?.nutrition.totalCalories.toString() || "0",
      subtitle: "kcal consumed",
      updateText: `${todaySummary?.nutrition.mealsCount || 0} meals`,
      backgroundColor: "#FF8C00",
      icon: "🥤",
      link: "/(tabs)/Explore/nutrition",
    },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Highlights</Text>
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
