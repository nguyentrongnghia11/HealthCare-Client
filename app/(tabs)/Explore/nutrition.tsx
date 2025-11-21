"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { getCalories } from '../../../api/nutrition'
import { AddMealModal } from "../../../components/AddMealModalProps"
import CalendarPicker from "../../../components/CalendarPicker"
import MealListItem from "../../../components/MealListItem"
import { NutritionStats } from "../../../components/NutritionStats"
import { ProgressCircle } from "../../../components/ProgressCircle"

const { width } = Dimensions.get("window")
const CHART_SIZE = width * 0.6

interface NutritionData {
    consumed: number
    total: number
    percentage: number
    fat: { value: number; percentage: number }
    protein: { value: number; percentage: number }
    carbs: { value: number; percentage: number }
}

interface Meal {
    id: string
    name: string
    time: string
    calories: number
    category: "breakfast" | "lunch" | "dinner" | "snack"
}

// Mock meals data
const mockMeals: { [key: string]: Meal[] } = {
    today: [
        { id: "1", name: "Oatmeal with berries", time: "08:00 AM", calories: 350, category: "breakfast" },
        { id: "2", name: "Grilled chicken salad", time: "12:30 PM", calories: 450, category: "lunch" },
        { id: "3", name: "Apple with almond butter", time: "03:00 PM", calories: 160, category: "snack" },
    ],
}

export default function NutritionScreen() {
    const theme = useTheme()
    const [showAddMealModal, setShowAddMealModal] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [loading, setLoading] = useState(false)
    const [apiSummary, setApiSummary] = useState<any | null>(null)
    const [apiUser, setApiUser] = useState<any | null>(null)
    const [apiMeals, setApiMeals] = useState<Meal[]>([])
    const [error, setError] = useState<string | null>(null)

    const [nutritionData, setNutritionData] = useState<NutritionData>({
        consumed: 0,
        total: 0,
        percentage: 0,
        fat: { value: 0, percentage: 0 },
        protein: { value: 0, percentage: 0 },
        carbs: { value: 0, percentage: 0 },
    })

    const isToday = () => {
        const today = new Date()
        return (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        )
    }

    const currentMeals = apiMeals.length > 0 ? apiMeals : (isToday() ? mockMeals.today : [])

    const fetchData = async () => {
        setLoading(true)
        setError(null)
        try {

            console.log("249423sjdfshdf")
            const dateStr = selectedDate.toISOString().split('T')[0]
            const res = await getCalories(dateStr)

            console.log("API response: ", res)

            setApiUser(res.user ?? null)
            setApiSummary(res.summary ?? null)

            const meals = (res.meals || []).map((m: any) => ({
                id: m._id || m.id || String(Math.random()),
                name: m.foodName || m.name || 'Unknown',
                time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                calories: m.calories || 0,
                category: 'lunch' as const,
            }))
            setApiMeals(meals)

            // compute macro totals from meals
            const totalProtein = (res.meals || []).reduce((s: number, it: any) => s + (it.protein || 0), 0)
            const totalCarbs = (res.meals || []).reduce((s: number, it: any) => s + (it.carbs || 0), 0)
            const totalFat = (res.meals || []).reduce((s: number, it: any) => s + (it.fat || 0), 0)

            const goal = res.user?.goal ?? nutritionData.total

            console.log("GOAL ", goal)
            const consumed = res.summary?.consumed ?? 0

            const proteinPct = res.user?.macroGoals?.protein ? Math.round((totalProtein * 100) / res.user.macroGoals.protein) : 0
            const carbsPct = res.user?.macroGoals?.carb ? Math.round((totalCarbs * 100) / res.user.macroGoals.carb) : 0
            const fatPct = res.user?.macroGoals?.fat ? Math.round((totalFat * 100) / res.user.macroGoals.fat) : 0

            setNutritionData({
                consumed,
                total: goal,
                percentage: goal ? Math.round((consumed * 100) / goal) : 0,
                fat: { value: totalFat, percentage: fatPct },
                protein: { value: totalProtein, percentage: proteinPct },
                carbs: { value: totalCarbs, percentage: carbsPct },
            })
        } catch (e: any) {
            setError(e.message ?? String(e))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedDate])

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <IconButton icon="chevron-left" size={28} onPress={() => { }} style={styles.backButton} />
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Nutrition
                </Text>
                <View style={styles.spacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CalendarPicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

                <View style={styles.titleSection}>
                    <View style={styles.consumedContainer}>
                        <Text variant="headlineLarge" style={{ fontWeight: "700" }}>
                            Consumed{" "}
                        </Text>
                        <Text variant="headlineLarge" style={styles.caloriesHighlight}>
                            {nutritionData.consumed} kcal
                        </Text>
                    </View>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        {isToday() ? "today" : "on this day"}
                    </Text>
                </View>

                {/* Circular Progress Chart */}
                <View style={styles.chartContainer}>
                    <ProgressCircle
                        carbs={nutritionData.carbs.percentage}
                        fat={nutritionData.fat.percentage}
                        percentage={nutritionData.percentage}
                        protein={nutritionData.protein.percentage}
                        consumed={nutritionData.consumed}
                        goal={nutritionData.total}

                    />
                </View>

                {/* Nutrition Stats */}
                <View style={styles.statsContainer}>
                    <NutritionStats
                        label="Fat"
                        value={nutritionData.fat.value}
                        unit="g"
                        percentage={nutritionData.fat.percentage}
                        color="#E8956A"
                    />
                    <NutritionStats
                        label="Protein"
                        value={nutritionData.protein.value}
                        unit="g"
                        percentage={nutritionData.protein.percentage}
                        color="#E67676"
                    />
                    <NutritionStats
                        label="Carbs"
                        value={nutritionData.carbs.value}
                        unit="g"
                        percentage={nutritionData.carbs.percentage}
                        color="#00BDD4"
                    />
                </View>

                <View style={styles.mealsSection}>
                    <Text variant="titleMedium" style={styles.mealsSectionTitle}>
                        Meals Today
                    </Text>
                    {currentMeals.length > 0 ? (
                        <View style={styles.mealsList}>
                            {currentMeals.map((meal) => (
                                <MealListItem
                                    key={meal.id}
                                    id={meal.id}
                                    name={meal.name}
                                    time={meal.time}
                                    calories={meal.calories}
                                    category={meal.category}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons name={"plate-empty" as any} size={48} color="#CCC" />
                            <Text style={styles.emptyStateText}>No meals logged for this day</Text>
                        </View>
                    )}
                </View>

                {/* Spacer */}
                <View style={styles.spacer2} />
            </ScrollView>

            {/* Add Meals Button */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => setShowAddMealModal(true)}
                    style={styles.addButton}
                    contentStyle={styles.addButtonContent}
                    labelStyle={styles.addButtonLabel}
                    icon={({ size, color }) => <MaterialCommunityIcons name="plus-circle" size={size} color={color} />}
                >
                    Add meals
                </Button>
            </View>

            {/* Add Meal Modal */}
            <AddMealModal
                visible={showAddMealModal}
                onDismiss={() => setShowAddMealModal(false)}
                nutritionData={nutritionData}
                setNutritionData={setNutritionData}
                onSuccess={fetchData}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingTop: 16,
        paddingBottom: 12,
    },
    backButton: {
        margin: 0,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontWeight: "600",
    },
    spacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    titleSection: {
        alignItems: "center",
        marginVertical: 24,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "400",
    },
    consumedContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginVertical: 8,
    },

    caloriesHighlight: {
        color: "#00BDD4",
    },
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 32,
    },
    statsContainer: {
        gap: 16,
        marginTop: 32,
    },
    mealsSection: {
        marginTop: 40,
        marginBottom: 20,
    },
    mealsSectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    mealsList: {
        gap: 0,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 32,
        backgroundColor: "#F9F9F9",
        borderRadius: 12,
    },
    emptyStateText: {
        fontSize: 14,
        color: "#999",
        marginTop: 8,
    },
    spacer2: {
        height: 24,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    addButton: {
        borderRadius: 30,
        backgroundColor: "#00BDD4",
    },
    addButtonContent: {
        paddingVertical: 8,
    },
    addButtonLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
})
