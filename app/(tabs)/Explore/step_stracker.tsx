import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getSuggestedActivity, getTodayRunningData, saveRunningSession } from "../../../api/running";

const { width } = Dimensions.get("window");

// Custom Progress Circle Component (Giữ nguyên)
const ProgressCircle = ({
  percent,
  radius,
  borderWidth,
  color,
  shadowColor,
  bgColor,
  children,
}: {
  percent: number;
  radius: number;
  borderWidth: number;
  color: string;
  shadowColor: string;
  bgColor: string;
  children?: React.ReactNode;
}) => {
  const size = radius * 2;
  const strokeWidth = borderWidth;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size}>
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke={shadowColor}
          strokeWidth={strokeWidth}
          fill={bgColor}
        />
        <Circle
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, { alignItems: 'center', justifyContent: 'center' }]}>
        {children}
      </View>
    </View>
  );
}; interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function RunningScreen() {
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Today's total data (from previous sessions)
  const [todayTotalData, setTodayTotalData] = useState({
    timeElapsed: 0,
    distanceKm: 0,
    caloriesBurned: 0,
  });

  // Current session data (only this run)
  const [currentSessionData, setCurrentSessionData] = useState({
    timeElapsed: 0,
    distanceKm: 0,
    caloriesBurned: 0,
  });

  // Targets from API
  const [targets, setTargets] = useState({
    kcal: 0,
    km: 0,
    timeMinutes: 0,
    calorieRate: 0
  });  // Fetch suggested activity on mount
  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const data = await getSuggestedActivity();
        console.log('Suggested activity data:', data.suggestedActivity);
        setTargets({
          kcal: data.suggestedActivity.kcal,
          km: data.suggestedActivity.km,
          timeMinutes: data.suggestedActivity.timeMinutes,
          calorieRate: data.suggestedActivity.caloriesPerKmRate
        });
        // Keep tracking data at 0 until user starts running
      } catch (error) {
        console.error('Failed to fetch suggested activity:', error);
      }
    };
    fetchTargets();
  }, []);

  // Fetch today's running data and load into todayTotalData
  useEffect(() => {
    const loadTodayData = async () => {
      try {
        const todayData = await getTodayRunningData();
        console.log('Today running data:', todayData);
        
        // Load summary into today's total data
        if (todayData.summary) {
          setTodayTotalData({
            timeElapsed: todayData.summary.totalTimeSeconds,
            distanceKm: todayData.summary.totalDistanceKm,
            caloriesBurned: todayData.summary.totalCaloriesBurned,
          });
        }
        
        // Update targets if available from response
        if (todayData.target) {
          setTargets(prev => ({
            ...prev,
            kcal: todayData.target!.kcal,
            km: todayData.target!.km,
            timeMinutes: todayData.target!.timeMinutes,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch today running data:', error);
      }
    };
    
    loadTodayData();
  }, []);

  // Auto-reset when new day starts
  useEffect(() => {
    const checkAndResetIfNewDay = async () => {
      try {
        const savedDate = await AsyncStorage.getItem('lastRunningDate');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (savedDate && savedDate !== today) {
          // New day detected, reset all data
          console.log('New day detected, resetting all data');
          setTodayTotalData({
            timeElapsed: 0,
            distanceKm: 0,
            caloriesBurned: 0,
          });
          setCurrentSessionData({
            timeElapsed: 0,
            distanceKm: 0,
            caloriesBurned: 0,
          });
        }
        
        // Save current date
        await AsyncStorage.setItem('lastRunningDate', today);
      } catch (error) {
        console.error('Error checking date:', error);
      }
    };

    checkAndResetIfNewDay();
  }, []); 
  const lastLocationRef = useRef<LocationCoords | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer và vị trí
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentSessionData((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);      // start watching location (minh họa)
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 4000,
            distanceInterval: 5,
          },
          (loc) => {
            const { latitude, longitude } = loc.coords;
            const newLoc: LocationCoords = { latitude, longitude };

            console.log ('New location:', newLoc);

            if (lastLocationRef.current) {
              const prev = lastLocationRef.current;
              const dx = latitude - prev.latitude;
              const dy = longitude - prev.longitude;
              // approx meters (very rough) — thay bằng hàm calculateDistance nếu có
              const meters = Math.sqrt(dx * dx + dy * dy) * 111000;
              const km = meters / 1000;
              const rate = targets.calorieRate;

              console.log (parseFloat((km).toFixed(2)))

              setCurrentSessionData((prev) => {
                const newDistance = parseFloat((prev.distanceKm + km).toFixed(2));
                const newCals = Math.round(newDistance * rate);
                return {
                  ...prev,
                  distanceKm: newDistance,
                  caloriesBurned: newCals,
                };
              });
            } lastLocationRef.current = newLoc;
          }
        );
      })();
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, [isRunning]);

  const stopRunning = async () => {
    setIsRunning(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Send ONLY current session data to backend
    if (currentSessionData.timeElapsed > 0) {
      try {
        await saveRunningSession({
          distanceKm: currentSessionData.distanceKm,
          caloriesBurned: currentSessionData.caloriesBurned,
          timeSeconds: currentSessionData.timeElapsed,
        });
        
        // Reload today's total data after saving
        const todayData = await getTodayRunningData();
        if (todayData.summary) {
          setTodayTotalData({
            timeElapsed: todayData.summary.totalTimeSeconds,
            distanceKm: todayData.summary.totalDistanceKm,
            caloriesBurned: todayData.summary.totalCaloriesBurned,
          });
        }
        
        // Reset current session
        setCurrentSessionData({
          timeElapsed: 0,
          distanceKm: 0,
          caloriesBurned: 0,
        });
        
        Alert.alert(
          'Session Saved',
          `Finished: ${currentSessionData.distanceKm.toFixed(2)} km, ${Math.floor(currentSessionData.caloriesBurned)} kcal\n\nData has been saved to your profile.`,
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Failed to save running session:', error);
        Alert.alert(
          'Session Completed',
          `Finished: ${currentSessionData.distanceKm.toFixed(2)} km, ${Math.floor(currentSessionData.caloriesBurned)} kcal\n\nFailed to save data to server.`,
          [{ text: 'OK' }]
        );
      }
    }
  };

  // Calculate total displayed data (today's total + current session)
  const displayData = {
    timeElapsed: todayTotalData.timeElapsed + currentSessionData.timeElapsed,
    distanceKm: todayTotalData.distanceKm + currentSessionData.distanceKm,
    caloriesBurned: todayTotalData.caloriesBurned + currentSessionData.caloriesBurned,
  };

  // progress % cho mỗi vòng nhỏ
  const caloriesProgress = Math.min(100, (displayData.caloriesBurned / targets.kcal) * 100);
  const distanceProgress = Math.min(100, (displayData.distanceKm / targets.km) * 100);
  const timeProgress = Math.min(100, (displayData.timeElapsed / (targets.timeMinutes * 60)) * 100); const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const pace = displayData.distanceKm > 0 ? (displayData.timeElapsed / 60 / displayData.distanceKm).toFixed(1) : "0.0";
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentPadding}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <MaterialIcons name="arrow-back-ios" size={22} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Running</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Top Text */}
        <Text style={styles.goalText}>
          You have achieved{" "}
          <Text style={{ color: "#00D2E6", fontWeight: "700" }}>
            {Math.round(caloriesProgress)}%
          </Text>
          {" "}of your goal today
        </Text>

        {/* Main big progress circle (calories) */}
        <View style={styles.mainCircleWrap}>
          <ProgressCircle
            percent={caloriesProgress}
            radius={width * 0.28}
            borderWidth={16}
            color="#00D2E6"
            shadowColor="#E6F7F8"
            bgColor="#fff"
          >
            <MaterialCommunityIcons name="fire" size={42} color="#00D2E6" />
            <Text style={styles.mainValue}>{Math.floor(displayData.caloriesBurned)}</Text>
            <Text style={styles.mainLabel}>kcal out of {targets.kcal}</Text>
          </ProgressCircle>
        </View>

        {/* Small progress rings */}
        <View style={styles.smallRow}>
          <View style={styles.smallItem}>
            <ProgressCircle
              percent={caloriesProgress}
              radius={38}
              borderWidth={8}
              color="#FF8A00"
              shadowColor="#FFEDE2"
              bgColor="#fff"
            >
              <MaterialCommunityIcons name="fire" size={20} color="#FF8A00" />
            </ProgressCircle>
            <Text style={styles.smallValue}>{Math.floor(displayData.caloriesBurned)}/{targets.kcal}</Text>
            <Text style={styles.smallUnit}>kcal</Text>
          </View>

          <View style={styles.smallItem}>
            <ProgressCircle
              percent={distanceProgress}
              radius={38}
              borderWidth={8}
              color="#E94A4A"
              shadowColor="#FDEDED"
              bgColor="#fff"
            >
              <MaterialCommunityIcons name="map-marker-distance" size={20} color="#E94A4A" />
            </ProgressCircle>
            <Text style={styles.smallValue}>{displayData.distanceKm.toFixed(2)}/{targets.km}</Text>
            <Text style={styles.smallUnit}>km</Text>
          </View>

          <View style={styles.smallItem}>
            <ProgressCircle
              percent={timeProgress}
              radius={38}
              borderWidth={8}
              color="#00D2E6"
              shadowColor="#E8FBFD"
              bgColor="#fff"
            >
              <MaterialCommunityIcons name="clock-outline" size={20} color="#00D2E6" />
            </ProgressCircle>
            <Text style={styles.smallValue}>{formatTime(displayData.timeElapsed)}/{formatTime(targets.timeMinutes * 60)}</Text>
            <Text style={styles.smallUnit}>min</Text>
          </View>

        </View>

        {/* Chart card */}
        <View style={styles.chartCard}>
          <View style={styles.toggleWrap}>
            <TouchableOpacity style={styles.tabActive}><Text style={styles.tabActiveText}>Today</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Weekly</Text></TouchableOpacity>
            <TouchableOpacity style={styles.tab}><Text style={styles.tabText}>Monthly</Text></TouchableOpacity>
          </View>

          <View style={styles.chartPlaceholder}>
            <Text style={{ color: "#fff" }}>Chart placeholder</Text>
          </View>
        </View>

        {/* Vùng đệm để nội dung cuộn không bị nút cố định che khuất */}
        <View style={styles.footerSpacer} />

      </ScrollView>

      {/* Fixed START Button (Không có container bao bọc) */}
      <TouchableOpacity
        style={[
          styles.startBtn,
          styles.fixedStartBtn, // Style cố định mới
          { backgroundColor: isRunning ? "#FF5252" : "#00D2E6" }
        ]}
        onPress={() => (isRunning ? stopRunning() : setIsRunning(true))}
      >
        <MaterialIcons name="directions-run" size={18} color="#fff" />
        <Text style={styles.startText}>{isRunning ? "STOP RUNNING" : "START RUNNING"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flex: 1 },
  scrollContentPadding: { paddingBottom: 10 },
  header: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 18 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  goalText: { textAlign: "center", marginTop: 14, fontSize: 16, color: "#333", paddingHorizontal: 18 },

  mainCircleWrap: { alignItems: "center", marginTop: 18 },

  mainValue: { fontSize: 40, fontWeight: "800", marginTop: 8, color: "#222" },
  mainLabel: { fontSize: 13, color: "#777", marginTop: 4 },

  smallRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18, paddingHorizontal: 16 },
  smallItem: { alignItems: "center" },
  smallValue: { marginTop: 6, fontSize: 15, fontWeight: "700" },
  smallUnit: { fontSize: 12, color: "#666" },

  chartCard: { backgroundColor: "#00D2E6", borderRadius: 14, marginTop: 22, paddingVertical: 12, paddingHorizontal: 12, marginHorizontal: 18 },
  toggleWrap: { flexDirection: "row", alignSelf: "center", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, padding: 4 },
  tabActive: { backgroundColor: "#fff", borderRadius: 18, paddingVertical: 6, paddingHorizontal: 16 },
  tabActiveText: { color: "#00D2E6", fontWeight: "700" },
  tab: { paddingVertical: 6, paddingHorizontal: 16, justifyContent: "center", alignItems: "center" },
  tabText: { color: "#fff", fontWeight: "600" },
  chartPlaceholder: { height: 150, marginTop: 12, borderRadius: 10, backgroundColor: "rgba(0,0,0,0.08)", justifyContent: "center", alignItems: "center" },

  // FIX: Style CỐ ĐỊNH Áp dụng cho TouchableOpacity
  fixedStartBtn: {
    position: 'absolute',
    bottom: 36, // Khoảng cách từ đáy
    left: 18,    // Padding ngang
    right: 18,   // Padding ngang
    elevation: 8, // Thêm elevation (cho Android)
    shadowColor: '#000', // Thêm shadow (cho iOS)
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  // Vùng đệm cuối ScrollView
  footerSpacer: {
    height: 14 + 36 + 10 + 56, // Padding dọc nút (14*2) + paddingBottom (36) + margin trên (10) + chiều cao nút
  },

  // Base START Button Style
  startBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: 14, borderRadius: 28 },
  startText: { color: "#fff", fontSize: 16, fontWeight: "800", marginLeft: 10 },
});