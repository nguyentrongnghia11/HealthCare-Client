import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';
import { calculateDistance } from '../../../utils/distances'; // Đảm bảo đường dẫn đúng

// GIẢ ĐỊNH DỮ LIỆU TỪ SERVER
// Trong ứng dụng thực tế, các giá trị này sẽ được fetch từ NestJS Backend
const USER_WEIGHT = 70; // kg (Lấy từ DB)
const CALORIE_RATE_PER_KM = USER_WEIGHT; // 70 kcal/km
const TARGET_CALORIES = 500; // kcal (Mục tiêu cho buổi tập)

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function RunningTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [distanceKm, setDistanceKm] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const lastLocationRef = useRef<LocationCoords | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  // Hàm xử lý việc ghi lại tọa độ và tính toán
  const locationUpdateHandler = (location: Location.LocationObject) => {
    const newLocation: LocationCoords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    if (lastLocationRef.current) {
      const meters = calculateDistance(
        lastLocationRef.current.latitude,
        lastLocationRef.current.longitude,
        newLocation.latitude,
        newLocation.longitude,
      );

      const newDistanceKm = meters / 1000;

      setDistanceKm((prev) => {
        const totalKm = prev + newDistanceKm;
        // Tính Calo: Calo = Tổng Km * Định mức (kcal/km)
        setCaloriesBurned(Math.round(totalKm * CALORIE_RATE_PER_KM)); 
        return parseFloat(totalKm.toFixed(2));
      });
    }

    lastLocationRef.current = newLocation;
  };

  // --- Bắt đầu theo dõi ---
  const startTracking = async () => {
    // 1. Yêu cầu quyền vị trí nền trước
    let { status } = await Location.requestForegroundPermissionsAsync();
    
    // 2. Yêu cầu quyền vị trí nền (cần thiết cho Android 10+ và iOS)
    if (Platform.OS === 'ios') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
          Alert.alert("Lỗi quyền", "Cần quyền truy cập vị trí nền để theo dõi khi khóa màn hình.");
          return;
      }
    } else if (status !== 'granted') {
      Alert.alert("Lỗi quyền", "Cần quyền truy cập vị trí để bắt đầu.");
      return;
    }


    setIsRunning(true);
    lastLocationRef.current = null;
    
    // Bắt đầu lắng nghe vị trí với độ chính xác cao
    subscriptionRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 5000, 
        distanceInterval: 10,
      },
      locationUpdateHandler 
    );
  };

  // --- Dừng theo dõi ---
  const stopTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove(); // Dừng lắng nghe
      subscriptionRef.current = null;
    }
    setIsRunning(false);
    
    Alert.alert(
      "Buổi tập kết thúc", 
      `Bạn đã chạy ${distanceKm} km và đốt ${caloriesBurned} kcal. Dữ liệu sẽ được gửi lên server.`
    );
    
    // TODO: GỌI API NESTJS ĐỂ GỬI DỮ LIỆU CUỐI CÙNG TẠI ĐÂY
    // Ví dụ: api.post('/workouts', { distance: distanceKm, calories: caloriesBurned, target: TARGET_CALORIES });
  };

  // Cleanup: Đảm bảo dừng theo dõi khi component bị hủy
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const progress = Math.min(100, (caloriesBurned / TARGET_CALORIES) * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theo dõi Chạy Bộ</Text>

      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Khoảng Cách (km)</Text>
        <Text style={styles.dataValue}>{distanceKm.toFixed(2)}</Text>
      </View>

      <View style={styles.dataContainer}>
        <Text style={styles.dataLabel}>Calo Đã Đốt (kcal)</Text>
        <Text style={[styles.dataValue, { color: '#FF7043' }]}>{caloriesBurned}</Text>
        <Text style={styles.progressText}>Mục tiêu: {TARGET_CALORIES} kcal ({progress.toFixed(0)}%)</Text>
      </View>

      <Button
        title={isRunning ? 'DỪNG CHẠY' : 'BẮT ĐẦU CHẠY'}
        onPress={isRunning ? stopTracking : startTracking}
        color={isRunning ? '#E53935' : '#4CAF50'}
      />
      
      {!isRunning && distanceKm > 0 && (
          <Button title="Thiết lập lại" onPress={() => { setDistanceKm(0); setCaloriesBurned(0); }} color="#808080" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  dataContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  dataLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  dataValue: {
    fontSize: 50,
    fontWeight: '900',
    color: '#1E88E5',
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});