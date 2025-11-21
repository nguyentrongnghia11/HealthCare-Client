// app/index.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { refreshAccessToken, verifyToken } from '../api/auth';
import { getUserDetail } from '../api/user';

export default function Index() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkLoginStatus() {
            try {
                const token = await AsyncStorage.getItem('token');

                // No token found, redirect to login
                if (!token) {
                    setIsLoggedIn(false);
                    return;
                }

                // Verify token with backend
                const isValid = await verifyToken();

                if (isValid) {
                    // Token is valid, check if user has detail from backend
                    console.log('Token is valid, checking user detail...');
                    const userDetail = await getUserDetail();
                    console.log('User detail result:', userDetail ? 'Has detail' : 'No detail');
                    setOnboardingCompleted(userDetail !== null);
                    setIsLoggedIn(true);
                } else {
                    // Token invalid, try to refresh
                    console.log('Token invalid, attempting refresh...');
                    const refreshed = await refreshAccessToken();

                    if (refreshed) {
                        console.log('Token refreshed successfully');
                        const userDetail = await getUserDetail();
                        console.log('User detail after refresh:', userDetail ? 'Has detail' : 'No detail');
                        setOnboardingCompleted(userDetail !== null);
                        setIsLoggedIn(true);
                    } else {
                        // Refresh failed, redirect to login
                        console.log('Token refresh failed, redirecting to login');
                        setIsLoggedIn(false);
                    }
                }

            } catch (e) {
                console.error("Lỗi khi kiểm tra đăng nhập:", e);
                setIsLoggedIn(false);
            }
        }

        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Đang kiểm tra đăng nhập...</Text>
            </View>
        );
    }

    if (isLoggedIn) {
        console.log("User authenticated, onboarding completed:", onboardingCompleted);
        if (onboardingCompleted === false) {
            return <Redirect href="/(onboarding)/welcome" />;
        }
        return <Redirect href="/Overview" />;
    }

    return <Redirect href="/login" />;
}