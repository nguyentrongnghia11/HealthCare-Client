"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import type React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

interface MealListItemProps {
  id: string
  name: string
  time: string
  calories: number
  category: "breakfast" | "lunch" | "dinner" | "snack"
  image?: string
}

const categoryConfig = {
  breakfast: { icon: "coffee", color: "#FF9500" },
  lunch: { icon: "silverware-fork-knife", color: "#FF6B6B" },
  dinner: { icon: "silverware-fork-knife", color: "#00BCD4" },
  snack: { icon: "cookie", color: "#9C27B0" },
}

export default function MealListItem({ id, name, time, calories, category }: MealListItemProps) {
  const config = categoryConfig[category]

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
        <MaterialCommunityIcons name={config.icon as any} size={20} color={config.color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.mealName}>{name}</Text>
        <Text style={styles.mealTime}>{time}</Text>
      </View>

      {/* Calories */}
      <View style={styles.caloriesContainer}>
        <Text style={styles.caloriesValue}>{calories}</Text>
        <Text style={styles.caloriesUnit}>kcal</Text>
      </View>

      {/* Chevron */}
      <MaterialCommunityIcons name="chevron-right" size={20} color="#CCC" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 12,
    fontWeight: "400",
    color: "#999",
  },
  caloriesContainer: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  caloriesValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  caloriesUnit: {
    fontSize: 10,
    fontWeight: "500",
    color: "#999",
  },
})
