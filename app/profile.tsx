import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { logout } from '../api/auth/auth';
import { getUserDetail, updateUserDetail } from '../api/user';
import account from '../assets/images/overview/account.png';

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.profileSection}>
          <Image source={account} style={styles.avatar} />
          <Text style={styles.name}>{userInfo.name || userInfo.username || 'User'}</Text>
          <Text style={styles.email}>{userInfo.email || 'No email'}</Text>
        </View>

        {/* User Details */}
        {userDetail && (
          <View style={styles.detailsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <MaterialIcons 
                  name={isEditing ? "close" : "edit"} 
                  size={24} 
                  color="#00D2E6" 
                />
              </TouchableOpacity>
            </View>

            {/* Birthday */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Birthday</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editData.birthday}
                  onChangeText={(text) => setEditData({ ...editData, birthday: text })}
                  placeholder="YYYY-MM-DD"
                />
              ) : (
                <Text style={styles.value}>{userDetail.birthday}</Text>
              )}
            </View>

            {/* Gender */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender</Text>
              {isEditing ? (
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[styles.genderButton, editData.gender && styles.genderButtonActive]}
                    onPress={() => setEditData({ ...editData, gender: true })}
                  >
                    <Text style={[styles.genderText, editData.gender && styles.genderTextActive]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderButton, !editData.gender && styles.genderButtonActive]}
                    onPress={() => setEditData({ ...editData, gender: false })}
                  >
                    <Text style={[styles.genderText, !editData.gender && styles.genderTextActive]}>Female</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.value}>{userDetail.gender ? 'Male' : 'Female'}</Text>
              )}
            </View>

            {/* Height */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Height</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editData.height.toString()}
                  onChangeText={(text) => setEditData({ ...editData, height: parseFloat(text) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="cm"
                />
              ) : (
                <Text style={styles.value}>{userDetail.height} cm</Text>
              )}
            </View>

            {/* Weight */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Weight</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editData.weight.toString()}
                  onChangeText={(text) => setEditData({ ...editData, weight: parseFloat(text) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="kg"
                />
              ) : (
                <Text style={styles.value}>{userDetail.weight} kg</Text>
              )}
            </View>

            {/* Activity Level */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Activity Level</Text>
              <Text style={styles.value}>{userDetail.activityLevel}</Text>
            </View>

            {/* Target */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Goal</Text>
              <Text style={styles.value}>
                {userDetail.target === 'lose' ? 'Lose Weight' : userDetail.target === 'gain' ? 'Gain Weight' : 'Maintain Weight'}
              </Text>
            </View>

            {/* Target Weight */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Target Weight</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editData.targetWeight.toString()}
                  onChangeText={(text) => setEditData({ ...editData, targetWeight: parseFloat(text) || 0 })}
                  keyboardType="decimal-pad"
                  placeholder="kg"
                />
              ) : (
                <Text style={styles.value}>{userDetail.targetWeight} kg</Text>
              )}
            </View>

            {/* Target Days */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>Target Days</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editData.targetTimeDays.toString()}
                  onChangeText={(text) => setEditData({ ...editData, targetTimeDays: parseInt(text) || 0 })}
                  keyboardType="number-pad"
                  placeholder="days"
                />
              ) : (
                <Text style={styles.value}>{userDetail.targetTimeDays} days</Text>
              )}
            </View>

            {/* Save Button */}
            {isEditing && (
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  input: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 100,
    textAlign: 'right',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#F9F9F9',
  },
  genderButtonActive: {
    backgroundColor: '#00D2E6',
    borderColor: '#00D2E6',
  },
  genderText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#00D2E6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
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
    marginBottom: 32,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
});
