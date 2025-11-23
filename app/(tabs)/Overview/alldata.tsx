import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCalories } from '../../../api/nutrition';
import { getTodayRunningData } from '../../../api/running';
import back from '../../../assets/images/overview/back.png';
import { HealthMetricCard } from '../../../components/HealthMetricCard';



export default function TabOneScreen() {
  const router = useRouter();
  const [runningKm, setRunningKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Fetch running data
        const runningData = await getTodayRunningData();
        console.log('Running data response:', runningData);
        if (runningData.summary) {
          console.log('Total distance km:', runningData.summary.totalDistanceKm);
          setRunningKm(runningData.summary.totalDistanceKm || 0);
        }

        // Fetch nutrition data with date
        const nutritionData = await getCalories(dateStr);
        console.log('Nutrition data response:', nutritionData);
        console.log('Nutrition data meals:', nutritionData.meals);
        
        if (nutritionData && nutritionData.meals && Array.isArray(nutritionData.meals)) {
          const totalCalories = nutritionData.meals.reduce((sum: number, meal: any) => {
            console.log('Meal calories:', meal.calories);
            return sum + (meal.calories || 0);
          }, 0);
          console.log('Total calories calculated:', totalCalories);
          setCaloriesBurned(totalCalories);
        } else {
          console.log('No meals data found or invalid format');
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    };

    fetchData();
  }, []);
//them cycle tracking
  const handleMetricPress = (id: string) => {
    console.log('Metric pressed:', id);
    if (id === 'calories') {
      console.log('Navigating to nutrition...');
      router.push('/(tabs)/Explore/nutrition');
    } else if (id === 'steps') {
      console.log('Navigating to step_stracker...');
      router.push('/(tabs)/Explore/step_stracker');
    }else if (id === 'cycle') {
      console.log('Navigating to cycle...');
      router.push('/(tabs)/Overview/cycletracking');
    }
  };

  const healthMetrics = [
    {
      id: "double-support",
      title: "Double Support Time",
      value: "29.7",
      unit: "%",
      icon: "🎯",
      color: "bg-cyan-500",
      iconBg: "bg-cyan-100",
    },
    {
      id: "steps",
      title: "Steps",
      value: runningKm > 0 ? runningKm.toFixed(2) : "0.00",
      unit: "km",
      icon: "👟",
      color: "bg-orange-500",
      iconBg: "bg-orange-100",
    },
    {
      id: "cycle",
      title: "Cycle tracking",
      value: "08 April",
      unit: "",
      icon: "📅",
      color: "bg-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      id: "sleep",
      title: "Sleep",
      value: "7",
      unit: "hr",
      secondaryValue: "31",
      secondaryUnit: "min",
      icon: "🛏️",
      color: "bg-red-500",
      iconBg: "bg-red-100",
    },
    {
      id: "calories",
      title: "Burned calories",
      value: caloriesBurned > 0 ? Math.floor(caloriesBurned).toString() : "0",
      unit: "kcal",
      icon: "🔥",
      color: "bg-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      id: "bmi",
      title: "Body mass index",
      value: "18.69",
      unit: "BMI",
      icon: "⚖️",
      color: "bg-cyan-500",
      iconBg: "bg-cyan-100",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Link href="./" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={back} style={styles.headerButton} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>All Health Data</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.metricsContainer}>
        {healthMetrics.map((metric) => (
          <HealthMetricCard 
            key={metric.id} 
            metric={metric} 
            onPress={() => handleMetricPress(metric.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 8,
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#27b315',
  },
  headerSpacer: {
    width: 40,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12,
  },
});