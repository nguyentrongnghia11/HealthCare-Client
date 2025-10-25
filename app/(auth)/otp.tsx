"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { verifyRegister } from "../../api/auth/auth"
import { useOtp } from "../OtpContext"

export default function OTPScreen({ navigation, route }: any) {
    const { email = "nghianguyen15012004@gmail.com" } = route?.params || {}
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [timeLeft, setTimeLeft] = useState(60)
    const inputRefs = useRef<Array<TextInput | null>>([])

    const { otpData } = useOtp();
    console.log("Dữ liệu OTP:", otpData.username, otpData.email, otpData.password);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp]
        newOtp[index] = text.replace(/[^0-9]/g, "")

        if (newOtp[index] && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }

        setOtp(newOtp)
    }

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleVerifyOtp = async () => {
        const otpCode = otp.join("")

        if (otpCode.length !== 6) {
            Alert.alert("Error", "Please enter all 6 digits")
            return
        }

        const rs = await verifyRegister({ ...otpData, otpCode })
        if (!rs) { alert("Dang ki khong thanh cong") }
        else {
            router.push('/Overview')
        }

    }

    const handleResendOtp = () => {
        setOtp(["", "", "", "", "", ""])
        setTimeLeft(60)
        Alert.alert("Success", "OTP code has been resent to your email")
    }

    const maskedEmail = email
        ? `${email.substring(0, 3)}***${email.substring(email.lastIndexOf("@") - 3)}`
        : "***@***.com"

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Back Button */}
                <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="chevron-left" size={28} color="#212121" />
                </TouchableOpacity>

                {/* Icon */}
                <View style={styles.iconContainer}>
                    <View style={styles.iconWrapper}>
                        <MaterialCommunityIcons name="shield-check" size={40} color="#00BDD4" />
                    </View>
                </View>

                {/* Title */}
                <View style={styles.header}>
                    <Text style={styles.mainTitle}>Verify Your Email</Text>
                    <Text style={styles.subTitle}>
                        We've sent a 6-digit code to{"\n"}
                        <Text style={styles.emailHighlight}>{maskedEmail}</Text>
                    </Text>
                </View>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                inputRefs.current[index] = ref
                            }}
                            style={[
                                styles.otpInput,
                                digit && styles.otpInputFilled,
                                otp.join("").length === 6 && styles.otpInputComplete,
                            ]}
                            maxLength={1}
                            keyboardType="number-pad"
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            placeholder="-"
                            placeholderTextColor="#CCC"
                            editable={timeLeft > 0}
                        />
                    ))}
                </View>

                {/* Timer */}
                <View style={styles.timerContainer}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={timeLeft < 20 ? "#FF6B6B" : "#757575"} />
                    <Text style={[styles.timerText, timeLeft < 20 && styles.timerTextWarning]}>{timeLeft}s</Text>
                </View>

                {/* Verify Button */}
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="check-circle" size={20} color="#fff" style={styles.buttonIcon} />
                    <Text style={styles.verifyText}>Verify Code</Text>
                </TouchableOpacity>

                {/* Resend OTP */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <TouchableOpacity onPress={handleResendOtp} disabled={timeLeft > 0}>
                        <Text style={[styles.resendLink, timeLeft > 0 && styles.resendLinkDisabled]}>Resend OTP</Text>
                    </TouchableOpacity>
                </View>

                {/* Info */}
                <View style={styles.infoContainer}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#00BDD4" />
                    <Text style={styles.infoText}>Check your spam folder if you don't see the email</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    backButton: {
        marginBottom: 24,
        width: 40,
        height: 40,
        justifyContent: "center",
    },
    iconContainer: {
        alignItems: "center",
        marginBottom: 28,
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E0F7FA",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: "#212121",
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 14,
        color: "#757575",
        textAlign: "center",
        lineHeight: 20,
    },
    emailHighlight: {
        color: "#00BDD4",
        fontWeight: "600",
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 28,
        gap: 8,
    },
    otpInput: {
        flex: 1,
        height: 60,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#E0E0E0",
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        color: "#212121",
        backgroundColor: "#F9F9F9",
    },
    otpInputFilled: {
        borderColor: "#00BDD4",
        backgroundColor: "#E0F7FA",
    },
    otpInputComplete: {
        borderColor: "#00BDD4",
        backgroundColor: "#E0F7FA",
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
        gap: 6,
    },
    timerText: {
        fontSize: 14,
        color: "#757575",
        fontWeight: "600",
    },
    timerTextWarning: {
        color: "#FF6B6B",
    },
    verifyButton: {
        backgroundColor: "#00BDD4",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
        shadowColor: "#00BDD4",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    buttonIcon: {
        marginRight: 8,
    },
    verifyText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    resendContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    resendText: {
        color: "#757575",
        fontSize: 14,
    },
    resendLink: {
        color: "#00BDD4",
        fontSize: 14,
        fontWeight: "600",
    },
    resendLinkDisabled: {
        color: "#999",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#E0F7FA",
        borderRadius: 8,
        gap: 10,
    },
    infoText: {
        fontSize: 12,
        color: "#00695C",
        flex: 1,
    },
})
