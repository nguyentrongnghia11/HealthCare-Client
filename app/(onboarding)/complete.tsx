import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { updateUserDetail } from '../../api/user';

export default function CompleteScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Gather all onboarding data
      const personalData = await AsyncStorage.getItem('onboarding_personal');
      const physicalData = await AsyncStorage.getItem('onboarding_physical');
      const goalData = await AsyncStorage.getItem('onboarding_goal');
      const activityLevel = await AsyncStorage.getItem('onboarding_activity');

      const personal = personalData ? JSON.parse(personalData) : {};
      const physical = physicalData ? JSON.parse(physicalData) : {};
      const goal = goalData ? JSON.parse(goalData) : {};

      // Send to backend: PUT /user/me/detail
      // Expected: {birthday, weight, height, activityLevel, target, targetTimeDays, targetWeight, gender:boolean}
      let backendTarget = goal.target;
      if (backendTarget === 'lose') {
        backendTarget = 'lost';
      }
      
      const detailData = {
        birthday: personal.birthday, // YYYY-MM-DD string
        gender: personal.gender, // boolean: true=male, false=female
        height: physical.height, // number (cm)
        weight: physical.weight, // number (kg)
        activityLevel: activityLevel || 'moderate', // string
        target: backendTarget, // lost|maintain|gain
        targetWeight: goal.targetWeight, // number
        targetTimeDays: goal.targetTimeDays, // number
      };

      console.log('Sending data to backend:', detailData);

      try {
        await updateUserDetail(detailData);
      } catch (err: any) {
        console.log('API error status:', err.response?.status);
        console.log('API error headers:', err.response?.headers);
        console.log('API error data:', err.response?.data);
        throw err;
      }

      // Mark onboarding as complete
      await AsyncStorage.setItem('onboarding_completed', 'true');

      // Clear temporary onboarding data
      await AsyncStorage.multiRemove([
        'onboarding_personal',
        'onboarding_physical',
        'onboarding_goal',
        'onboarding_activity',
      ]);

      // Navigate to main app
      router.replace('/Explore' as any);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check" size={60} color="#00D2E6" />
          </View>
        </View>

        <Text style={styles.title}>You're All Set!</Text>
        <Text style={styles.subtitle}>
          Your personalized health profile is ready. Let's start your journey to a healthier you!
        </Text>

        <View style={styles.featuresContainer}>
          <FeatureItem 
            icon="restaurant" 
            title="Personalized Nutrition" 
            description="Track meals and reach your calorie goals"
          />
          <FeatureItem 
            icon="directions-run" 
            title="Activity Tracking" 
            description="Monitor your runs and workouts"
          />
          <FeatureItem 
            icon="insights" 
            title="Progress Insights" 
            description="See your health improvements over time"
          />
        </View>
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleComplete}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.completeButtonText}>Start My Journey</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <MaterialIcons name={icon} size={24} color="#00D2E6" />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D2E6',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 24,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresContainer: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  completeButton: {
    backgroundColor: '#00D2E6',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
