import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PhysicalStatsScreen() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleContinue = async () => {
    if (!height || !weight) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await AsyncStorage.setItem('onboarding_physical', JSON.stringify({ 
        height: parseFloat(height), 
        weight: parseFloat(weight) 
      }));
      router.push('/(onboarding)/goals' as any);
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
        <Text style={styles.stepText}>Step 2 of 5</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '40%' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Physical Stats</Text>
        <Text style={styles.subtitle}>Help us calculate your health metrics</Text>

        {/* Height Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your height"
            value={height}
            onChangeText={setHeight}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* Weight Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your weight"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>

        {/* BMI Preview */}
        {height && weight && (
          <View style={styles.bmiContainer}>
            <Text style={styles.bmiLabel}>Your BMI:</Text>
            <Text style={styles.bmiValue}>
              {(parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, (!height || !weight) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!height || !weight}
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
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
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
  bmiContainer: {
    backgroundColor: '#F0F9FA',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  bmiValue: {
    fontSize: 24,
    color: '#00D2E6',
    fontWeight: '800',
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
