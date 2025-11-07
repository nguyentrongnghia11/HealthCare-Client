"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'
import { router } from "expo-router"
import { useEffect, useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native"
import { Checkbox, Text, TextInput } from "react-native-paper"
import { login } from "../../api/auth/auth"


export default function LoginScreen() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async () => {
    const res = await login({ identifier, password })

    if (!res) {
      alert("Dang nhap khong thanh cong ");
    }
    else {
      router.push("/(tabs)/Explore")
    }
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '103191199587-vgn4vvs8id2slu1hdtka99feb3tunsek.apps.googleusercontent.com',
      offlineAccess: true,
    })
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      
      try {
        await GoogleSignin.signOut()
      } catch (e) {
        // ignore signOut errors — proceed to signIn
        console.debug('Google signOut (ignored) error', e)
      }

      const userInfo = await GoogleSignin.signIn()

      console.log('Google user:', userInfo)
      router.push("/(tabs)/Explore")
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('User cancelled google sign in')
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress')
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Google Play Services not available or outdated')
      } else {
        console.error(error)
        alert('Google sign-in error')
      }
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="heart-pulse" size={48} color="#00BDD4" />
            </View>
            <Text style={styles.mainTitle}>Login</Text>
            <Text style={styles.subTitle}>Login to continue your health journey</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputField}>
                <MaterialCommunityIcons name="email-outline" size={20} color="#00BDD4" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#BDBDBD"
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputField}>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#00BDD4" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#BDBDBD"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#00BDD4"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberMe}>
                <Checkbox
                  status={rememberMe ? "checked" : "unchecked"}
                  onPress={() => setRememberMe(!rememberMe)}
                  color="#00BDD4"
                />
                <Text style={styles.rememberText}>Remember me</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} activeOpacity={0.8} onPress={handleLogin}>
            <MaterialCommunityIcons name="login" size={22} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* Create Account */}
          <View style={styles.createAccountContainer}>
            <Text style={styles.createAccountText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => { router.push('/(auth)/register') }}>
              <Text style={styles.createAccountLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={handleGoogleSignIn}
            >
              <MaterialCommunityIcons name="google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <MaterialCommunityIcons name="facebook" size={24} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => handleSocialLogin("Apple")}
            >
              <MaterialCommunityIcons name="apple" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  headerIcon: {
    marginBottom: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E0F7FA",
    justifyContent: "center",
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#212121",
    backgroundColor: "transparent",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    fontSize: 14,
    color: "#424242",
    marginLeft: 4,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00BDD4",
  },
  signInButton: {
    backgroundColor: "#00BDD4",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#00BDD4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  createAccountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  createAccountText: {
    fontSize: 14,
    color: "#757575",
  },
  createAccountLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00BDD4",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    fontSize: 12,
    color: "#BDBDBD",
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  spacer: {
    height: 40,
  },
})
