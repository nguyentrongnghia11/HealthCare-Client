import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getWeeklyCalories } from "../../api/nutrition";
import { getWeeklyStats, WeeklyStats } from "../../api/overview";
import { Colors, useTheme } from "../../contexts/ThemeContext";
import StatsChartModal from "./StatsChartModal";

export default function ThisWeekReport() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [weeklyCalories, setWeeklyCalories] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStat, setSelectedStat] = useState<{ type: 'steps' | 'calories' | 'water' | 'sleep', title: string } | null>(null);

  const loadWeeklyStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const [statsData, caloriesData] = await Promise.all([
        getWeeklyStats(),
        getWeeklyCalories(),
      ]);
      setStats(statsData);
      setWeeklyCalories(caloriesData);
    } catch (error) {
      console.error('Error loading weekly stats:', error);
      // Use default values on error
      setStats({
        steps: 0,
        caloriesBurned: 0,
        waterMl: 0,
        sleepMinutes: 0,
      });
      setWeeklyCalories(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadWeeklyStats();
    }, [loadWeeklyStats])
  );

  const formatSleepTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const handleCardPress = (type: 'steps' | 'calories' | 'water' | 'sleep', title: string) => {
    setSelectedStat({ type, title });
    setModalVisible(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>This week report</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D2E6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>This week report</Text>
        <TouchableOpacity>
          <Text style={[styles.viewMore, { color: colors.textSecondary }]}>View more →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.reportItem, { backgroundColor: colors.surface, borderColor: isDark ? '#00D2E6' : '#27b315' }]}
          onPress={() => handleCardPress('steps', 'Steps')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>👟</Text>
            <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>Steps</Text>
          </View>
          <Text style={[styles.itemValue, { color: colors.text }]}>
            {stats?.steps.toLocaleString() || '0'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.reportItem, { backgroundColor: colors.surface, borderColor: isDark ? '#00D2E6' : '#27b315' }]}
          onPress={() => handleCardPress('calories', 'Calories Consumed')}
        >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🔥</Text>
              <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>Calories</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {weeklyCalories.toLocaleString()} kcal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.reportItem, { backgroundColor: colors.surface, borderColor: isDark ? '#00D2E6' : '#27b315' }]}
            onPress={() => handleCardPress('water', 'Water Intake')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>💧</Text>
              <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>Water</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {stats?.waterMl.toLocaleString() || '0'} ml
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.reportItem, { backgroundColor: colors.surface, borderColor: isDark ? '#00D2E6' : '#27b315' }]}
            onPress={() => handleCardPress('sleep', 'Sleep Duration')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>😴</Text>
              <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>Sleep</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {stats ? formatSleepTime(stats.sleepMinutes) : '0h 0min'}
            </Text>
          </TouchableOpacity>
      </View>

      {/* Stats Chart Modal */}
      {selectedStat && (
        <StatsChartModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type={selectedStat.type}
          title={selectedStat.title}
        />
      )}
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
  },
  viewMore: {
    fontSize: 14,
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
    padding: 12,
    borderRadius: 12,
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
    fontWeight: "500",
  },
  itemValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})