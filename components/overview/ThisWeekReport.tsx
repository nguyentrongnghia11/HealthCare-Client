import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getWeeklySummary, WeeklySummary } from "../../api/overview";
import { Colors, useTheme } from "../../contexts/ThemeContext";
import StatsChartModal from "./StatsChartModal";

export default function ThisWeekReport() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStat, setSelectedStat] = useState<{ type: 'steps' | 'calories' | 'cycle' | 'sleep', title: string } | null>(null);

  const loadWeeklyStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getWeeklySummary();
      setSummary(data);
    } catch (error) {
      console.error('Error loading weekly summary:', error);
      // Use default values on error
      setSummary({
        weeklyCaloriesConsumed: 0,
        weeklySleepHours: 0,
        weeklySteps: 0,
        weeklyAvgCaloriesFromMeals: 0,
        weeklyCaloriesBurned: 0,
        nextPeriodPrediction: '',
      });
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

  const formatSleepTime = (hours: number) => {
    return `${hours}h`;
  };

  const getDaysUntilPeriod = (prediction: string) => {
    if (!prediction) return 0;
    const today = new Date();
    const predictedDate = new Date(prediction);
    const diffTime = predictedDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleCardPress = (type: 'steps' | 'calories' | 'cycle' | 'sleep', title: string) => {
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
            {summary?.weeklySteps.toLocaleString() || '0'}
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
              {summary?.weeklyCaloriesConsumed.toLocaleString() || '0'} kcal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.reportItem, { backgroundColor: colors.surface, borderColor: isDark ? '#00D2E6' : '#27b315' }]}
            onPress={() => handleCardPress('cycle', 'Cycle Tracking')}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>📅</Text>
              <Text style={[styles.itemTitle, { color: colors.textSecondary }]}>Cycle</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.text }]}>
              {summary ? getDaysUntilPeriod(summary.nextPeriodPrediction) : '0'} days
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
              {summary ? formatSleepTime(summary.weeklySleepHours) : '0h'}
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