// app/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text } from 'react-native';

export default function Index() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const userJson = await AsyncStorage.getItem('user');
                setIsLoggedIn(!!userJson);

            } catch (e) {
                console.error("Lỗi khi lấy dữ liệu:", e);
                setIsLoggedIn(false);
            }
        }

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return <Text>Loading...</Text>;
    }
    if (isLoggedIn) {
        console.log("user heheh");
        return <Redirect href="/Explore" />;
    }

    // 5. Nếu chưa đăng nhập
    return <Redirect href="/login" />;
}