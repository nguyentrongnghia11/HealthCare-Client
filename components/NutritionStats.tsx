import type React from "react"
import { StyleSheet, View } from "react-native"
import { Surface, Text } from "react-native-paper"

interface NutritionStatsProps {
  label: string
  value: number
  unit: string
  percentage: number
  color: string
}

export const NutritionStats: React.FC<NutritionStatsProps> = ({ label, value, unit, percentage, color }) => {
  return (
    <Surface style={[styles.container, { backgroundColor: "#FAFAFA" }]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text variant="bodyMedium" style={styles.label}>
            {label}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.valueContainer}>
            <Text variant="bodyMedium" style={styles.value}>
              {value}
              <Text style={styles.unit}>{unit}</Text>
            </Text>
          </View>
          <View style={styles.percentageContainer}>
            <Text variant="bodySmall" style={[styles.percentage, { color: color }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </View>
    </Surface>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  label: {
    fontWeight: "500",
    fontSize: 15,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  valueContainer: {
    minWidth: 60,
  },
  value: {
    fontWeight: "600",
    fontSize: 15,
  },
  unit: {
    fontWeight: "400",
    fontSize: 13,
    marginLeft: 2,
  },
  percentageContainer: {
    minWidth: 45,
    alignItems: "flex-end",
  },
  percentage: {
    fontWeight: "600",
    fontSize: 14,
  },
})
