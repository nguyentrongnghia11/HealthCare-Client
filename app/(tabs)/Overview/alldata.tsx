import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCalories } from '../../../api/nutrition';
import { getTodaySummary } from '../../../api/overview';
import { getTodayRunningData } from '../../../api/running';
import back from '../../../assets/images/overview/back.png';
import { HealthMetricCard } from '../../../components/HealthMetricCard';



export default function TabOneScreen() {
  const router = useRouter();
  const [runningKm, setRunningKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepMinutes, setSleepMinutes] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Fetch running data
        const runningData = await getTodayRunningData();
        if (runningData.summary) {
          setRunningKm(runningData.summary.totalDistanceKm || 0);
        }

        // Fetch nutrition data with date
        const nutritionData = await getCalories(dateStr);
        if (nutritionData && nutritionData.meals && Array.isArray(nutritionData.meals)) {
          const totalCalories = nutritionData.meals.reduce((sum: number, meal: any) => {
            return sum + (meal.calories || 0);
          }, 0);
          setCaloriesBurned(totalCalories);
        }

        // Fetch today summary for sleep data
        const todaySummary = await getTodaySummary();
        if (todaySummary?.sleep?.bedtime && todaySummary?.sleep?.wakeup) {
          const [bedHour, bedMin] = todaySummary.sleep.bedtime.split(':').map(Number);
          const [wakeHour, wakeMin] = todaySummary.sleep.wakeup.split(':').map(Number);
          
          let bedTimeInMinutes = bedHour * 60 + bedMin;
          let wakeTimeInMinutes = wakeHour * 60 + wakeMin;
          
          if (wakeTimeInMinutes < bedTimeInMinutes) {
            wakeTimeInMinutes += 24 * 60;
          }
          
          const totalMinutes = wakeTimeInMinutes - bedTimeInMinutes;
          setSleepHours(Math.floor(totalMinutes / 60));
          setSleepMinutes(totalMinutes % 60);
        }
      } catch (error) {
        console.error('Failed to fetch health data:', error);
      }
    };

    fetchData();
  }, []);
//them cycle tracking
  const handleMetricPress = (id: string) => {
    if (id === 'calories') {
      router.push('/(tabs)/Explore/nutrition');
    } else if (id === 'steps') {
      router.push('/(tabs)/Explore/step_stracker');
<<<<<<< HEAD
    } else if (id === 'cycle') {
      router.push('/(tabs)/Overview/cycletracking');
    } else if (id === 'sleep') {
      router.push('/(tabs)/Overview/sleep');
=======
    }else if (id === 'cycle') {
      console.log('Navigating to cycle...');
      router.push('/(tabs)/Overview/cycletracking');
>>>>>>> d72d46e7172116249f75167c2c98151eb9c5c3b3
    }
  };

  const healthMetrics = [
    {
      id: "steps",
      title: "Distance",
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
      value: sleepHours.toString(),
      unit: "hr",
      secondaryValue: sleepMinutes.toString(),
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