import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { logout } from '../../../api/auth/auth';
import { getUserDetail, updateUserDetail } from '../../../api/user';
import account from '../../../assets/images/overview/account.png';
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
  target: 'lose' | 'maintain' | 'gain';
  targetWeight: number;
  targetTimeDays: number;
}

export default function ProfileScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D2E6" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#00D2E6', '#00B8CC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image source={account} style={styles.avatar} />
              <View style={styles.onlineBadge} />
            </View>
            <Text style={styles.userName}>{userInfo.name || userInfo.username || 'User'}</Text>
            <Text style={styles.userEmail}>{userInfo.email || 'No email'}</Text>
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        {userDetail && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="monitor-weight" size={24} color="#00D2E6" />
              <Text style={styles.statValue}>{userDetail.weight} kg</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="flag" size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>{userDetail.targetWeight} kg</Text>
              <Text style={styles.statLabel}>Target</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialIcons name="calendar-today" size={24} color="#4ECDC4" />
              <Text style={styles.statValue}>{userDetail.targetTimeDays}</Text>
              <Text style={styles.statLabel}>Days</Text>
            </View>
          </View>
        )}

        {/* User Details Section */}
        {userDetail && (
          <View style={styles.detailsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
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
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="cake" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Birthday</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={editData.birthday}
                      onChangeText={(text) => setEditData({ ...editData, birthday: text })}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userDetail.birthday}</Text>
                  )}
                </View>
              </View>

              {/* Gender */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="person" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Gender</Text>
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
                    <Text style={styles.infoValue}>{userDetail.gender ? 'Male' : 'Female'}</Text>
                  )}
                </View>
              </View>

              {/* Height */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="height" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Height</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={editData.height.toString()}
                      onChangeText={(text) => setEditData({ ...editData, height: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="cm"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userDetail.height} cm</Text>
                  )}
                </View>
              </View>

              {/* Weight */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="monitor-weight" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={editData.weight.toString()}
                      onChangeText={(text) => setEditData({ ...editData, weight: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="kg"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userDetail.weight} kg</Text>
                  )}
                </View>
              </View>

              {/* Activity Level */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="directions-run" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Activity Level</Text>
                  <Text style={styles.infoValue}>{userDetail.activityLevel}</Text>
                </View>
              </View>

              {/* Goal */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="flag" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Goal</Text>
                  <Text style={styles.infoValue}>
                    {userDetail.target === 'lose' ? 'Lose Weight' : userDetail.target === 'gain' ? 'Gain Weight' : 'Maintain Weight'}
                  </Text>
                </View>
              </View>

              {/* Target Weight */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="track-changes" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Target Weight</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={editData.targetWeight.toString()}
                      onChangeText={(text) => setEditData({ ...editData, targetWeight: parseFloat(text) || 0 })}
                      keyboardType="decimal-pad"
                      placeholder="kg"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userDetail.targetWeight} kg</Text>
                  )}
                </View>
              </View>

              {/* Target Days */}
              <View style={styles.infoCard}>
                <View style={styles.infoIconContainer}>
                  <MaterialIcons name="event" size={20} color="#00D2E6" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Target Days</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.infoInput}
                      value={editData.targetTimeDays.toString()}
                      onChangeText={(text) => setEditData({ ...editData, targetTimeDays: parseInt(text) || 0 })}
                      keyboardType="number-pad"
                      placeholder="days"
                      placeholderTextColor="#999"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{userDetail.targetTimeDays} days</Text>
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
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
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
    backgroundColor: '#fff',
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
    color: '#222',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
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
    backgroundColor: '#fff',
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
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 16,
    color: '#222',
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
});
