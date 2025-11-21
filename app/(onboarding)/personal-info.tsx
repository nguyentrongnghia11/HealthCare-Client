import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PersonalInfoScreen() {
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState<boolean | null>(null); // true = male, false = female
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  const handleContinue = async () => {
    if (!birthday || gender === null) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await AsyncStorage.setItem('onboarding_personal', JSON.stringify({ birthday, gender }));
      router.push('/(onboarding)/physical-stats' as any);
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
        <Text style={styles.stepText}>Step 1 of 5</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '20%' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

        {/* Birthday Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity 
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.dateText, !birthday && styles.placeholderText]}>
              {birthday || 'Select your birthday'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Birthday</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <MaterialIcons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              {/* Date Pickers */}
              <View style={styles.pickerContainer}>
                {/* Year */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Year</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <TouchableOpacity
                        key={year}
                        style={[styles.pickerItem, selectedYear === year && styles.pickerItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[styles.pickerItemText, selectedYear === year && styles.pickerItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Month */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Month</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <TouchableOpacity
                        key={month}
                        style={[styles.pickerItem, selectedMonth === month && styles.pickerItemActive]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text style={[styles.pickerItemText, selectedMonth === month && styles.pickerItemTextActive]}>
                          {month.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Day */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Day</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <TouchableOpacity
                        key={day}
                        style={[styles.pickerItem, selectedDay === day && styles.pickerItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[styles.pickerItemText, selectedDay === day && styles.pickerItemTextActive]}>
                          {day.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
                  setBirthday(formattedDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Gender Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[styles.genderButton, gender === true && styles.genderButtonActive]}
              onPress={() => setGender(true)}
            >
              <Text style={[styles.genderText, gender === true && styles.genderTextActive]}>
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderButton, gender === false && styles.genderButtonActive]}
              onPress={() => setGender(false)}
            >
              <Text style={[styles.genderText, gender === false && styles.genderTextActive]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, (!birthday || gender === null) && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!birthday || gender === null}
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
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#222',
  },
  placeholderText: {
    color: '#999',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#00D2E6',
    borderColor: '#00D2E6',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  genderTextActive: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  dateList: {
    maxHeight: 400,
  },
  dateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dateItemText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerScroll: {
    maxHeight: 200,
    flexGrow: 0,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  pickerItemActive: {
    backgroundColor: '#E0F7FA',
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 16,
    color: '#666',
  },
  pickerItemTextActive: {
    color: '#00D2E6',
    fontWeight: '700',
  },
  confirmButton: {
    backgroundColor: '#00D2E6',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
