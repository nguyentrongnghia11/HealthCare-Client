"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Text } from "react-native-paper"

interface CalendarPickerProps {
    selectedDate: Date
    onDateSelect: (date: Date) => void
}

export default function CalendarPicker({ selectedDate, onDateSelect }: CalendarPickerProps) {
    const currentDate = new Date()
    const scrollViewRef = useRef<ScrollView>(null)
    
    const [displayMonth, setDisplayMonth] = useState<Date>(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    )

    const getDaysWindow = () => {
        const year = displayMonth.getFullYear()
        const month = displayMonth.getMonth()
        const days = []
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate()

        for (let day = 1; day <= totalDaysInMonth; day++) {
            days.push(new Date(Date.UTC(year, month, day)))
        }
        return days
    }

    const daysWindow = getDaysWindow() 

    const isToday = (date: Date) => {
        return (
            date.getDate() === currentDate.getDate() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getFullYear() === currentDate.getFullYear()
        )
    }

    const isSelected = (date: Date) => {
        return (
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear()
        )
    }

    const getDayName = (date: Date) => {
        return date.toLocaleDateString("en-US", { weekday: "short" })
    }

    const goToPreviousMonth = () => {
        setDisplayMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(newDate.getMonth() - 1)
            onDateSelect(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            return newDate
        })
    }

    const goToNextMonth = () => {
        setDisplayMonth(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(newDate.getMonth() + 1)
            // Chọn ngày 1 của tháng mới
            onDateSelect(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            return newDate
        })
    }

    const goToToday = () => {
        console.log("123445")
        setDisplayMonth(new Date())
        onDateSelect(currentDate) 
    }
    
    useEffect(() => {
        const totalItemWidth = 82

        if (
            selectedDate.getFullYear() !== displayMonth.getFullYear() ||
            selectedDate.getMonth() !== displayMonth.getMonth()
        ) {
            setDisplayMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
        }

        const selectedIndex = daysWindow.findIndex(date => isSelected(date))

        let scrollPosition = 0
        if (selectedIndex !== -1) {
            scrollPosition = selectedIndex * totalItemWidth
        }

        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
                x: scrollPosition,
                animated: true
            })
        }, 100)

    }, [displayMonth, selectedDate])

    return (
        <View style={styles.container}>
            <View style={styles.monthNavigationContainer}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={goToPreviousMonth}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="chevron-left" size={24} color="#00BCD4" />
                </TouchableOpacity>

                <View style={styles.monthDisplay}>
                    <Text style={styles.monthText}>
                        {displayMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={goToNextMonth}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#00BCD4" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.todayButton}
                    onPress={goToToday}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="calendar-today" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollContainer}
                contentContainerStyle={styles.daysContainer}
                scrollEventThrottle={16}
            >
                {daysWindow.map((date, index) => {
                    const dayName = getDayName(date)
                    const dayNum = date.getDate()
                    const selected = isSelected(date)
                    const today = isToday(date)

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayItem,
                                selected && styles.dayItemSelected,
                            ]}
                            onPress={() => onDateSelect(date)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.dayName,
                                selected && styles.dayNameSelected,
                                today && !selected && styles.dayNameToday,
                            ]}>
                                {dayName}
                            </Text>

                            <View
                                style={[
                                    styles.dayNumber,
                                    today && !selected && styles.dayNumberToday,
                                    selected && styles.dayNumberSelected,
                                ]}
                            >
                                <Text style={[
                                    styles.dayNumberText,
                                    selected && styles.dayNumberTextSelected,
                                    today && !selected && styles.dayNumberTextToday,
                                ]}>
                                    {dayNum}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 24,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 28,
    },
    headerContent: {
        flex: 1,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1A1A1A",
        marginBottom: 6,
        letterSpacing: -0.5,
    },
    dateText: {
        fontSize: 14,
        color: "#A0A0A0",
        fontWeight: "500",
        letterSpacing: 0.3,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
    },
    monthNavigationContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 188, 212, 0.08)",
    },
    monthDisplay: {
        flex: 1,
        alignItems: "center",
    },
    monthText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1A1A1A",
        letterSpacing: 0.3,
    },
    todayButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#00BCD4",
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        marginHorizontal: -16,
    },
    daysContainer: {
        flexDirection: "row",
        paddingHorizontal: 16,
        gap: 12,
    },
    dayItem: {
        alignItems: "center",
        width: 70,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    dayItemSelected: {
        backgroundColor: "rgba(0, 188, 212, 0.08)",
    },
    dayName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#888",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    dayNameToday: {
        color: "#00BCD4",
    },
    dayNameSelected: {
        color: "#00BCD4",
        fontWeight: "700",
    },
    dayNumber: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F0F0",
    },
    dayNumberToday: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#00BCD4",
    },
    dayNumberSelected: {
        backgroundColor: "#00BCD4",
        shadowColor: "#00BCD4",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dayNumberText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#666",
    },
    dayNumberTextToday: {
        color: "#00BCD4",
        fontWeight: "700",
    },
    dayNumberTextSelected: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
})