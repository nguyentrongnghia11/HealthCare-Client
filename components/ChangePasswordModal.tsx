import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { BlurView } from "expo-blur"
import React, { useState } from "react"
import { Alert, Animated, Dimensions, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Button, Surface, Text } from "react-native-paper"
import instance from "../utils/axiosInstance"

interface ChangePasswordModalProps {
  visible: boolean
  onDismiss: () => void
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(0))
  const [loading, setLoading] = useState(false)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      // Reset form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
  }, [visible, slideAnim])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  })

  const handleSubmit = async () => {
    // Validation
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password')
      return
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password')
      return
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password')
      return
    }

    setLoading(true)
    try {
      await instance.put('/user/me/password', {
        currentPassword,
        newPassword,
      })
      
      Alert.alert('Success', 'Password changed successfully!')
      onDismiss()
    } catch (error: any) {
      console.error('Error changing password:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password'
      Alert.alert('Error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <BlurView intensity={95} style={styles.blurContainer}>
        <TouchableOpacity activeOpacity={1} style={styles.backdrop} onPress={onDismiss}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <Surface style={styles.surface} elevation={0}>
                {/* Handle Bar */}
                <View style={styles.handleBar} />

                {/* Header */}
                <View style={styles.header}>
                  <View>
                    <Text style={styles.headerTitle}>Change Password</Text>
                    <Text style={styles.headerSubtitle}>Update your password</Text>
                  </View>
                  <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={24} color="#999" />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                  {/* Current Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Current Password *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="lock" size={20} color="#00BDD4" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry={!showCurrentPassword}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                      />
                      <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                        <MaterialCommunityIcons 
                          name={showCurrentPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#999" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* New Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="lock-reset" size={20} color="#00BDD4" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                      />
                      <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        <MaterialCommunityIcons 
                          name={showNewPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#999" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm New Password *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="lock-check" size={20} color="#00BDD4" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                      />
                      <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <MaterialCommunityIcons 
                          name={showConfirmPassword ? "eye-off" : "eye"} 
                          size={20} 
                          color="#999" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Info Note */}
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#00BDD4" />
                    <Text style={styles.infoText}>
                      Password must be at least 6 characters long
                    </Text>
                  </View>
                </ScrollView>

                {/* Submit Button */}
                <View style={styles.footer}>
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    labelStyle={styles.submitButtonLabel}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </View>
              </Surface>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  )
}

const { height } = Dimensions.get("window")

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    maxHeight: height * 0.85,
  },
  surface: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
  },
  handleBar: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#000",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#000",
    paddingVertical: 14,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 189, 212, 0.08)",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  submitButton: {
    borderRadius: 16,
    backgroundColor: "#00BDD4",
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
})
