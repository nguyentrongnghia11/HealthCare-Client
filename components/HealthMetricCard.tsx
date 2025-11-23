import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HealthMetric {
  id: string
  title: string
  value: string
  unit: string
  secondaryValue?: string
  secondaryUnit?: string
  icon?: string   // emoji hoặc ký tự
  color?: string
  iconBg?: string
}

interface HealthMetricCardProps {
  metric: HealthMetric
  onPress?: () => void
}

const healthMetricsIcon = [
  {
    id: "double-support",
    icon: "🎯",
    iconBg: "#CFFAFE",
  },
  {
    id: "steps",
    icon: "👟",
    iconBg: "#FFEDD5",
  },
  {
    id: "cycle",
    icon: "📅",
    iconBg: "#E9D5FF",
  },
  {
    id: "sleep",
    icon: "🛏️",
    iconBg: "#FECACA",
  },
  {
    id: "calories",
    icon: "🔥",
    iconBg: "#DBEAFE",
  },
  {
    id: "bmi",
    icon: "⚖️",
    iconBg: "#CFFAFE",
  },
];

export function HealthMetricCard({ metric, onPress }: HealthMetricCardProps) {
  // Tìm icon config theo id
  const config = healthMetricsIcon.find(item => item.id === metric.id);

  const icon = config ? config.icon : metric.icon;
  const iconBg = config ? config.iconBg : metric.iconBg;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{metric.title}</Text>
        <View style={styles.values}>
          <Text style={styles.value}>{metric.value}</Text>
          <Text style={styles.unit}>{metric.unit}</Text>
          {metric.secondaryValue && (
            <>
              <Text style={[styles.value, { marginLeft: 8 }]}>
                {metric.secondaryValue}
              </Text>
              <Text style={styles.unit}>{metric.secondaryUnit}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: "#000",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  values: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  unit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});
