import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Goal = 'maintain' | 'gain' | 'lost' | '';

export default function GoalsScreen() {
  const [goal, setGoal] = useState<Goal>('');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetTimeDays, setTargetTimeDays] = useState('');

  const goals = [
    { id: 'lost' as Goal, title: 'Lose Weight', emoji: '🔥', description: 'Burn calories and reduce body fat' },
    { id: 'maintain' as Goal, title: 'Maintain Weight', emoji: '⚖️', description: 'Keep your current weight' },
    { id: 'gain' as Goal, title: 'Gain Weight', emoji: '💪', description: 'Build strength and muscle mass' },
  ];

  const handleContinue = async () => {
    const trimmedWeight = targetWeight.trim();
    const trimmedDays = targetTimeDays.trim();
    
    if (!goal || !trimmedWeight || !trimmedDays) {
      alert('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(trimmedWeight);
    const daysNum = parseInt(trimmedDays);

    if (isNaN(weightNum) || weightNum <= 0) {
      alert('Please enter a valid target weight');
      return;
    }

    if (isNaN(daysNum) || daysNum <= 0) {
      alert('Please enter a valid number of days');
      return;
    }

    try {
      await AsyncStorage.setItem('onboarding_goal', JSON.stringify({ 
        target: goal, 
        targetWeight: weightNum,
        targetTimeDays: daysNum
      }));
      router.push('/(onboarding)/activity-level' as any);
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
        <Text style={styles.stepText}>Step 3 of 5</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '60%' }]} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>What's Your Goal?</Text>
        <Text style={styles.subtitle}>Choose your primary health objective</Text>

        {/* Goal Cards */}
        <View style={styles.goalsContainer}>
          {goals.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.goalCard, goal === item.id && styles.goalCardActive]}
              onPress={() => setGoal(item.id)}
            >
              <Text style={styles.goalEmoji}>{item.emoji}</Text>
              <Text style={[styles.goalTitle, goal === item.id && styles.goalTitleActive]}>
                {item.title}
              </Text>
              <Text style={[styles.goalDescription, goal === item.id && styles.goalDescriptionActive]}>
                {item.description}
              </Text>
              {goal === item.id && (
                <View style={styles.checkmark}>
                  <MaterialIcons name="check" size={20} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Target Weight Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Target Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your target weight"
            value={targetWeight}
            onChangeText={setTargetWeight}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Target Time Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Time to Reach Goal (days)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 30, 60, 90"
            value={targetTimeDays}
            onChangeText={setTargetTimeDays}
            keyboardType="number-pad"
            placeholderTextColor="#999"
          />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, (!goal || !targetWeight.trim() || !targetTimeDays.trim()) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!goal || !targetWeight.trim() || !targetTimeDays.trim()}
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
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
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
    marginBottom: 32,
  },
  goalsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#222',
    backgroundColor: '#F9F9F9',
  },
  goalCard: {
    backgroundColor: '#F9F9F9',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
  },
  goalCardActive: {
    backgroundColor: '#F0F9FA',
    borderColor: '#00D2E6',
  },
  goalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  goalTitleActive: {
    color: '#00D2E6',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
  goalDescriptionActive: {
    color: '#00B8CC',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#00D2E6',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
