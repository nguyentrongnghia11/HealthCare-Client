"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import { Alert, Dimensions, ScrollView, StyleSheet, View } from "react-native"
import { Button, IconButton, Text, useTheme } from "react-native-paper"
import { AddMealModal } from "../../../components/AddMealModalProps"
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

export default function NutritionScreen() {
    const theme = useTheme()
    const [showAddMealModal, setShowAddMealModal] = useState(false)

    const [nutritionData, setNutritionData] = useState<NutritionData>({
        consumed: 0,
        total: 2000,
        percentage: 0,
        fat: { value: 0, percentage: 0 },
        protein: { value: 0, percentage: 0 },
        carbs: { value: 0, percentage: 0 },
    })

    const handleAddMeal = (type: "photo" | "camera" | "manual") => {
        setShowAddMealModal(false)

        switch (type) {
            case "photo":
                Alert.alert("Tải ảnh lên", "Chọn ảnh từ thư viện")
                break
            case "camera":
                Alert.alert("Chụp ảnh", "Mở camera để chụp món ăn")
                break
            case "manual":
                Alert.alert("Thêm thủ công", "Nhập thông tin dinh dưỡng")
                break
        }
    }

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
                {/* Title */}
                <View style={styles.titleSection}>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        You have
                    </Text>
                    <View style={styles.consumedContainer}>
                        <Text variant="headlineLarge" style={styles.consumed}>
                            consumed{" "}
                        </Text>
                        <Text variant="headlineLarge" style={[styles.consumed, styles.caloriesHighlight]}>
                            {nutritionData.consumed} kcal
                        </Text>
                    </View>
                    <Text variant="bodyLarge" style={styles.subtitle}>
                        today
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
                        goal={2000}

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
            // onSelectOption={handleAddMeal}
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
    consumed: {
        fontWeight: "600",
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
