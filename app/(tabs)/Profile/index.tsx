import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { logout } from '../../../api/auth/auth';
import { getUserDetail, updateUserDetail } from '../../../api/user';
import account from '../../../assets/images/overview/account.png';
import { Colors, useTheme } from '../../../contexts/ThemeContext';
interface UserInfo {
  email?: string;
  username?: string;
  name?: string;
}

interface UserDetailData {
  birthday: string;
  gender: boolean;
  height: number;
  weight: number;
  activityLevel: string;
  target: 'lost' | 'maintain' | 'gain';
  targetWeight: number;
  targetTimeDays: number;
}

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());

  // Edit states
  const [editData, setEditData] = useState<UserDetailData>({
    birthday: '',
    gender: true,
    height: 0,
    weight: 0,
    activityLevel: 'moderate',
    target: 'maintain',
    targetWeight: 0,
    targetTimeDays: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      // Load user info from AsyncStorage
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        setUserInfo(JSON.parse(userStr));
      }

      // Load user detail from API
      const detail = await getUserDetail();
      if (detail) {
        setUserDetail(detail);
        setEditData(detail);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserDetail(editData);
      setUserDetail(editData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              await AsyncStorage.multiRemove([
                'token',
                'refreshToken',
                'user',
                'onboarding_completed',
                'onboarding_personal',
                'onboarding_physical',
                'onboarding_goal',
                'onboarding_activity',
              ]);
              router.replace('/login');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D2E6" />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={isDark ? ['#005566', '#004455'] : ['#00D2E6', '#00B8CC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image source={account} style={styles.avatar} />
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.userName}>
              {userInfo.username || (userInfo.email?.replace(/@gmail\.com$/, '') || 'User')}
            </Text>
            
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        {userDetail && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <MaterialIcons name="monitor-weight" size={24} color="#00D2E6" />
              <Text style={[styles.statValue, { color: colors.text }]}>{userDetail.weight} kg</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <MaterialIcons name="flag" size={24} color="#FF6B6B" />
              <Text style={[styles.statValue, { color: colors.text }]}>{userDetail.targetWeight} kg</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Target</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <MaterialIcons name="calendar-today" size={24} color="#4ECDC4" />
              <Text style={[styles.statValue, { color: colors.text }]}>{userDetail.targetTimeDays}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Days</Text>
            </View>
          </View>
        )}

        {/* User Details Section */}
        {userDetail && (
          <View style={styles.detailsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
              <TouchableOpacity 
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}
              >
                <MaterialIcons 
                  name={isEditing ? "close" : "edit"} 
                  size={20} 
                  color={isEditing ? "#FF6B6B" : "#00D2E6"} 
                />
                <Text style={[styles.editButtonText, isEditing && styles.editButtonTextActive]}>
                  {isEditing ? 'Cancel' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCardsContainer}>
              {/* Birthday */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="cake" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Birthday</Text>
                  {isEditing ? (
                    <TouchableOpacity onPress={() => {
                      const currentDate = editData.birthday ? new Date(editData.birthday) : new Date();
                      setSelectedYear(currentDate.getFullYear());
                      setSelectedMonth(currentDate.getMonth() + 1);
                      setSelectedDay(currentDate.getDate());
                      setShowDatePicker(true);
                    }}>
                      <Text style={[styles.infoInput, { color: colors.text, paddingVertical: 8 }]}>
                        {editData.birthday ? new Date(editData.birthday).toLocaleDateString('en-GB') : 'Select date'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {new Date(userDetail.birthday).toLocaleDateString('en-GB')}
                    </Text>
                  )}
                </View>
              </View>

              {/* Gender */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="person" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Gender</Text>
                  {isEditing ? (
                    <View style={styles.genderToggle}>
                      <TouchableOpacity
                        style={[styles.genderOption, editData.gender && styles.genderOptionActive]}
                        onPress={() => setEditData({ ...editData, gender: true })}
                      >
                        <Text style={[styles.genderOptionText, editData.gender && styles.genderOptionTextActive]}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderOption, !editData.gender && styles.genderOptionActive]}
                        onPress={() => setEditData({ ...editData, gender: false })}
                      >
                        <Text style={[styles.genderOptionText, !editData.gender && styles.genderOptionTextActive]}>Female</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.gender ? 'Male' : 'Female'}</Text>
                  )}
                </View>
              </View>

              {/* Height */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="height" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Height</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.infoInput, { color: colors.text }]}
                      value={editData.height.toString()}
                      onChangeText={(text) => setEditData({ ...editData, height: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="cm"
                      placeholderTextColor={isDark ? "#666" : "#999"}
                    />
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.height} cm</Text>
                  )}
                </View>
              </View>

              {/* Weight */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="monitor-weight" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Weight</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.infoInput, { color: colors.text }]}
                      value={editData.weight.toString()}
                      onChangeText={(text) => setEditData({ ...editData, weight: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="kg"
                      placeholderTextColor={isDark ? "#666" : "#999"}
                    />
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.weight} kg</Text>
                  )}
                </View>
              </View>

              {/* Activity Level */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="directions-run" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Activity Level</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.activityLevel}</Text>
                </View>
              </View>

              {/* Goal */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="flag" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Goal</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>
                    {userDetail.target === 'lost' ? 'Lose Weight' : userDetail.target === 'gain' ? 'Gain Weight' : 'Maintain Weight'}
                  </Text>
                </View>
              </View>

              {/* Target Weight */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="track-changes" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Target Weight</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.infoInput, { color: colors.text }]}
                      value={editData.targetWeight.toString()}
                      onChangeText={(text) => setEditData({ ...editData, targetWeight: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="kg"
                      placeholderTextColor={isDark ? "#666" : "#999"}
                    />
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.targetWeight} kg</Text>
                  )}
                </View>
              </View>

              {/* Target Days */}
              <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="event" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Target Days</Text>
                  {isEditing ? (
                    <TextInput
                      style={[styles.infoInput, { color: colors.text }]}
                      value={editData.targetTimeDays.toString()}
                      onChangeText={(text) => setEditData({ ...editData, targetTimeDays: parseInt(text) || 0 })}
                      keyboardType="number-pad"
                      placeholder="days"
                      placeholderTextColor={isDark ? "#666" : "#999"}
                    />
                  ) : (
                    <Text style={[styles.infoValue, { color: colors.text }]}>{userDetail.targetTimeDays} days</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={['#00D2E6', '#00B8CC']}
                  style={styles.saveButtonGradient}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <MaterialIcons name="check" size={20} color="#fff" />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Custom Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.pickerContainer, { backgroundColor: colors.surface }]}>
              <Text style={[styles.pickerLabel, { color: colors.text }]}>Select Birthday</Text>
              <View style={styles.pickerRow}>
                {/* Year Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerColumnLabel, { color: colors.textSecondary }]}>Year</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[styles.pickerItem, selectedYear === year && styles.pickerItemActive]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[styles.pickerItemText, { color: colors.text }, selectedYear === year && styles.pickerItemTextActive]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                {/* Month Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerColumnLabel, { color: colors.textSecondary }]}>Month</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <TouchableOpacity
                        key={month}
                        style={[styles.pickerItem, selectedMonth === month && styles.pickerItemActive]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text style={[styles.pickerItemText, { color: colors.text }, selectedMonth === month && styles.pickerItemTextActive]}>
                          {month.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                {/* Day Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerColumnLabel, { color: colors.textSecondary }]}>Day</Text>
                  <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[styles.pickerItem, selectedDay === day && styles.pickerItemActive]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[styles.pickerItemText, { color: colors.text }, selectedDay === day && styles.pickerItemTextActive]}>
                          {day.toString().padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              <View style={styles.pickerButtons}>
                <TouchableOpacity
                  style={[styles.pickerButton, styles.pickerButtonCancel]}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.pickerButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pickerButton, styles.pickerButtonConfirm]}
                  onPress={() => {
                    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
                    setEditData({ ...editData, birthday: formattedDate });
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.pickerButtonTextConfirm}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: -30,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D2E6',
  },
  editButtonTextActive: {
    color: '#FF6B6B',
  },
  infoCardsContainer: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F9F9F9',
  },
  genderToggle: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
  },
  genderOptionActive: {
    backgroundColor: '#00D2E6',
    borderColor: '#00D2E6',
  },
  genderOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  genderOptionTextActive: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D2E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  pickerLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerColumnLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerScroll: {
    maxHeight: 200,
    flexGrow: 0,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  pickerItemActive: {
    backgroundColor: '#E0F7FA',
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  pickerItemTextActive: {
    color: '#00D2E6',
    fontWeight: '700',
  },
  pickerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerButtonCancel: {
    backgroundColor: '#F5F5F5',
  },
  pickerButtonConfirm: {
    backgroundColor: '#00D2E6',
  },
  pickerButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerButtonTextConfirm: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
