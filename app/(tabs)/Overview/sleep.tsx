"use client"

import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import back from '../../../assets/images/overview/back.png';
import EditBedtime from "./edit-bedtime";
import { getSleepForDate, getLatestSleep, saveSleepSchedule } from '../../../api/sleep'
import { ActivityIndicator } from 'react-native'

export default function Sleep() {
  const [activeTab, setActiveTab] = useState("weekly")
  const [activeBar, setActiveBar] = useState(0)
  const [isEditingBedtime, setIsEditingBedtime] = useState(false)
  const [bedtime, setBedtime] = useState("22:00")
  const [wakeup, setWakeup] = useState("07:30")
  const [saving, setSaving] = useState(false)

  const formatDate = (d = new Date()) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  // Load today's schedule; if not found, load latest saved schedule as default
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const today = formatDate()
        const data = await getSleepForDate(today)
        if (mounted && data) {
          setBedtime(data.bedtime)
          setWakeup(data.wakeup)
          return
        }
        // fallback to latest
        const latest = await getLatestSleep()
        if (mounted && latest) {
          setBedtime(latest.bedtime)
          setWakeup(latest.wakeup)
        }
      } catch (err) {
        console.error('Error loading sleep schedule', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  // Load series for chart (last 7 days)
  useEffect(() => {
    let mounted = true
    const loadSeries = async () => {
      try {
        const today = formatDate()
        const series = await (await import('../../../api/sleep')).getSleepSeries(today, 7)
        if (!mounted) return
        // series: [{date: 'YYYY-MM-DD', sleepMinutes: number}, ...]
        const hours = series.map((s: any) => Math.round(((s.sleepMinutes || 0) / 60) * 10) / 10)
        // ensure length 7
        if (hours.length === 7) {
          // use order as returned (start -> end)
          // overwrite local sleepData used by chart
          // convert to numbers
          for (let i = 0; i < 7; i++) {
            sleepData[i] = hours[i]
          }
        }
      } catch (err) {
        console.error('Failed to load sleep series', err)
      }
    }
    loadSeries()
    return () => { mounted = false }
  }, [])

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const sleepData = [7.2, 5.5, 6.8, 7.5, 6.3, 7.8, 7.1]
  const maxSleep = 8

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 32,
    },
    headerButton: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "500",
      color: "#666",
    },
    spacer: {
      width: 24,
    },
    statsSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    statsText: {
      fontSize: 16,
      color: "#333",
      marginBottom: 8,
      fontWeight: "500",
    },
    sleepTime: {
      fontSize: 28,
      fontWeight: "700",
      color: "#1abc9c",
      lineHeight: 34,
      textAlign: "center",
    },
    tabs: {
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
      marginBottom: 28,
    },
    tab: {
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 20,
      backgroundColor: "transparent",
    },
    tabActive: {
      backgroundColor: "#1abc9c",
    },
    tabText: {
      fontSize: 14,
      fontWeight: "500",
      color: "#1abc9c",
    },
    tabTextActive: {
      color: "#fff",
    },
    chart: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-around",
      height: 180,
      marginBottom: 28,
      paddingHorizontal: 8,
      gap: 8,
    },
    barWrapper: {
      flex: 1,
      alignItems: "center",
      gap: 8,
    },
    bar: {
      width: "100%",
      maxWidth: 32,
      backgroundColor: "#f0f0f0",
      borderRadius: 4,
    },
    barActive: {
      backgroundColor: "#1abc9c",
    },
    barLabel: {
      fontSize: 12,
      color: "#999",
      fontWeight: "500",
    },
    metrics: {
      flexDirection: "row",
      gap: 20,
      justifyContent: "center",
      marginBottom: 32,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: "#f9f9f9",
      borderRadius: 12,
    },
    metric: {
      alignItems: "center",
    },
    metricIcon: {
      fontSize: 24,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 12,
      color: "#666",
      marginBottom: 4,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: "700",
      color: "#333",
    },
    scheduleHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    scheduleTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    },
    scheduleEdit: {
      fontSize: 14,
      fontWeight: "500",
      color: "#1abc9c",
    },
    scheduleButtons: {
      flexDirection: "row",
      gap: 12,
    },
    scheduleBtn: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      flexDirection: "row",
    },
    scheduleBtnBedtime: {
      backgroundColor: "#e74c3c",
    },
    scheduleBtnWakeup: {
      backgroundColor: "#f39c12",
    },
    scheduleBtnText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 14,
    },
    scheduleIcon: {
      fontSize: 18,
    },
    scheduleTime: {
      fontWeight: "700",
      fontSize: 16,
      color: "#fff",
    },
    scheduleLabel: {
      fontSize: 12,
      color: "#fff",
      opacity: 0.9,
    },
  })

  const handleScheduleSave = (newBedtime: string, newWakeup: string) => {
    const save = async () => {
      setSaving(true)
      try {
        const date = formatDate()
        await saveSleepSchedule({ date, bedtime: newBedtime, wakeup: newWakeup })
        setBedtime(newBedtime)
        setWakeup(newWakeup)
        setIsEditingBedtime(false)
      } catch (err) {
        console.error('Failed to save schedule', err)
        // optionally show alert
      } finally {
        setSaving(false)
      }
    }
    save()
  }

  if (isEditingBedtime) {
    return (
      <EditBedtime
        initialBedtime={bedtime}
        initialWakeup={wakeup}
        onSave={handleScheduleSave}
        onBack={() => setIsEditingBedtime(false)}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Link href="./" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={back} style={styles.headerButton} />
          </TouchableOpacity>
          </Link>
          <Text style={styles.headerTitle}>Sleep</Text>
          <View style={styles.spacer} />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsText}>Your average time of sleep a day is</Text>
          <Text style={styles.sleepTime}>7h31 min</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {["Today", "Weekly", "Monthly"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab.toLowerCase() && styles.tabActive]}
              onPress={() => setActiveTab(tab.toLowerCase())}
            >
              <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chart}>
          {days.map((day, index) => (
            <TouchableOpacity key={day} style={styles.barWrapper} onPress={() => setActiveBar(index)}>
              <View
                style={[
                  styles.bar,
                  index === activeBar && styles.barActive,
                  { height: `${(sleepData[index] / maxSleep) * 100}%` },
                ]}
              />
              <Text style={styles.barLabel}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics */}
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricIcon}>😴</Text>
            <Text style={styles.metricLabel}>Sleep rate</Text>
            <Text style={styles.metricValue}>82%</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricIcon}>😴</Text>
            <Text style={styles.metricLabel}>Deepsleep</Text>
            <Text style={styles.metricValue}>1h 3min</Text>
          </View>
        </View>

        {/* Schedule */}
        <View>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Set your schedule</Text>
            <TouchableOpacity onPress={() => setIsEditingBedtime(true)}>
              <Text style={styles.scheduleEdit}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleButtons}>
            <TouchableOpacity
              style={[styles.scheduleBtn, styles.scheduleBtnBedtime]}
              onPress={() => setIsEditingBedtime(true)}
            >
              <Text style={styles.scheduleIcon}>🛏️</Text>
              <View>
                <Text style={styles.scheduleTime}>{bedtime}</Text>
                <Text style={styles.scheduleLabel}>pm</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.scheduleBtn, styles.scheduleBtnWakeup]}
              onPress={() => setIsEditingBedtime(true)}
            >
              <Text style={styles.scheduleIcon}>⏰</Text>
              <View>
                <Text style={styles.scheduleTime}>{wakeup}</Text>
                <Text style={styles.scheduleLabel}>am</Text>
              </View>
            </TouchableOpacity>
          </View>
          {saving && (
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#1abc9c" />
              <Text style={{ color: '#666', marginTop: 6 }}>Saving…</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
