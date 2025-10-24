import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import InputCustom from '../../components/InputCustom';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Phần trên cùng với tiêu đề và mô tả */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Login here</Text>
        <Text style={styles.subTitle}>Welcome back you've been missed!</Text>
      </View>

      {/* Phần nhập liệu Email và Password */}
      <View style={styles.formContainer}>
        <InputCustom
          
         label='Email'
         value=''
         onChangeText={() => {}}

        />
        <InputCustom
          
         label='Email'
         value=''
         onChangeText={() => {}}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Đăng nhập */}
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createAccount}>
        <Text style={styles.createAccountText}>Create new account</Text>
      </TouchableOpacity>

      <View style={styles.orContinueWithContainer}>
        <Text style={styles.orContinueWithText}>Or continue with</Text>
      </View>

      {/* Các nút đăng nhập mạng xã hội */}
      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.socialButton}>
          {/* Thay thế bằng icon Google */}
          <Text style={styles.socialIcon}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          {/* Thay thế bằng icon Facebook */}
          <Text style={styles.socialIcon}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          {/* Thay thế bằng icon Apple */}
          <Text style={styles.socialIcon}></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF7F5', // Màu nền tổng thể tương tự ảnh
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6F3D', // Màu cam đậm
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F9F9F9', // Màu nền nhạt cho input
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  forgotPassword: {
    color: '#FF6F3D', // Màu cam cho quên mật khẩu
    textAlign: 'right',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#FF6F3D', // Màu cam đậm cho nút Đăng nhập
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createAccount: {
    alignItems: 'center',
    marginBottom: 40,
  },
  createAccountText: {
    color: '#555',
    fontSize: 16,
  },
  orContinueWithContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orContinueWithText: {
    color: '#888',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15, // Khoảng cách giữa các nút
  },
  socialButton: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  socialIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#555',
  },
});