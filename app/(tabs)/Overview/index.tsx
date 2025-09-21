import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { HealthMetricCard } from '../../../components/HealthMetricCard';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

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
    value: "11,875",
    unit: "steps",
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
    value: "850",
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

export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Health Data</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.metricsContainer}>
        {healthMetrics.map((metric) => (
          <HealthMetricCard key={metric.id} metric={metric} />
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
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
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