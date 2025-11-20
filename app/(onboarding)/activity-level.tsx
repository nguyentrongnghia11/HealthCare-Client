import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | '';

export default function ActivityLevelScreen() {
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('');

  const levels = [
    { id: 'sedentary' as ActivityLevel, title: 'Sedentary', description: 'Little or no exercise', multiplier: '1.2x' },
    { id: 'light' as ActivityLevel, title: 'Lightly Active', description: 'Exercise 1-3 days/week', multiplier: '1.375x' },
    { id: 'moderate' as ActivityLevel, title: 'Moderately Active', description: 'Exercise 3-5 days/week', multiplier: '1.55x' },
    { id: 'active' as ActivityLevel, title: 'Very Active', description: 'Exercise 6-7 days/week', multiplier: '1.725x' },
    { id: 'very_active' as ActivityLevel, title: 'Extra Active', description: 'Intense exercise daily', multiplier: '1.9x' },
  ];

  const handleContinue = async () => {
    if (!activityLevel) {
      alert('Please select an activity level');
      return;
    }

    try {
      await AsyncStorage.setItem('onboarding_activity', activityLevel);
      router.push('/(onboarding)/complete' as any);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 4 of 5</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '80%' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Activity Level</Text>
        <Text style={styles.subtitle}>How active are you typically?</Text>

        {/* Activity Level Options */}
        <View style={styles.levelsContainer}>
          {levels.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.levelCard, activityLevel === item.id && styles.levelCardActive]}
              onPress={() => setActivityLevel(item.id)}
            >
              <View style={styles.levelContent}>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelTitle, activityLevel === item.id && styles.levelTitleActive]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.levelDescription, activityLevel === item.id && styles.levelDescriptionActive]}>
                    {item.description}
                  </Text>
                </View>
                <View style={[styles.multiplierBadge, activityLevel === item.id && styles.multiplierBadgeActive]}>
                  <Text style={[styles.multiplierText, activityLevel === item.id && styles.multiplierTextActive]}>
                    {item.multiplier}
                  </Text>
                </View>
              </View>
              {activityLevel === item.id && (
                <View style={styles.radioActive}>
                  <View style={styles.radioDot} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, !activityLevel && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!activityLevel}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 24,
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
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  levelsContainer: {
    gap: 12,
  },
  levelCard: {
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  levelCardActive: {
    backgroundColor: '#F0F9FA',
    borderColor: '#00D2E6',
  },
  levelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  levelTitleActive: {
    color: '#00D2E6',
  },
  levelDescription: {
    fontSize: 13,
    color: '#666',
  },
  levelDescriptionActive: {
    color: '#00B8CC',
  },
  multiplierBadge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  multiplierBadgeActive: {
    backgroundColor: '#00D2E6',
  },
  multiplierText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
  },
  multiplierTextActive: {
    color: '#fff',
  },
  radioActive: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00D2E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00D2E6',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  continueButton: {
    backgroundColor: '#00D2E6',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
