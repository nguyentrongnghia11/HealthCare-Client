import type React from "react"
import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import Svg, { Circle, Text as SvgText } from "react-native-svg"

interface ProgressCircleProps {
  consumed: number
  goal: number
  percentage: number
  fat: number
  protein: number
  carbs: number
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ consumed, goal, percentage, fat, protein, carbs }) => {
  const size = 220
  const strokeWidth = 18
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const getStrokeDashoffset = (percent: number) => {
    return circumference - (circumference * percent) / 100
  }

  const renderCircleLayer = (percent: number, color: string, index: number) => {
    const offset = 2 * Math.PI * radius * (index * 0.15)
    return (
      <Circle
        key={`layer-${index}`}
        cx={size / 2}
        cy={size / 2}
        r={radius - index * 22}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference - index * 2 * Math.PI * 22}
        strokeDashoffset={getStrokeDashoffset(percent)}
        strokeLinecap="round"
        opacity={0.85}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circles */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F0F0F0"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 22}
            fill="none"
            stroke="#F0F0F0"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius - 44}
            fill="none"
            stroke="#F0F0F0"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />

          {/* Progress circles */}
          {renderCircleLayer(carbs, "#00D4D4", 0)}
          {renderCircleLayer(protein, "#EE5A6F", 1)}
          {renderCircleLayer(fat, "#FF9F43", 2)}

          {/* Center text */}
          <SvgText x={size / 2} y={size / 2 - 12} textAnchor="middle" fontSize="48" fontWeight="700" fill="#000">
            {percentage}%
          </SvgText>
          <SvgText x={size / 2} y={size / 2 + 20} textAnchor="middle" fontSize="12" fill="#999" fontWeight="500">
            of {goal} kcal
          </SvgText>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#FF9F43" label="Fat" />
        <LegendItem color="#EE5A6F" label="Protein" />
        <LegendItem color="#00D4D4" label="Carbs" />
      </View>
    </View>
  )
}

interface LegendItemProps {
  color: string
  label: string
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  chartWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  legend: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
})
