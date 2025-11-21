import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { BlurView } from "expo-blur"
import React, { useState } from "react"
import { Alert, Animated, Dimensions, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Button, Surface, Text } from "react-native-paper"
import { addManualMeal, ManualMealData } from "../api/nutrition"

interface ManualEntryModalProps {
  visible: boolean
  onDismiss: () => void
  onSuccess?: () => void
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ visible, onDismiss, onSuccess }) => {
  const [slideAnim] = useState(new Animated.Value(0))
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState<ManualMealData>({
    foodName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  })

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
      // Reset form when closed
      setFormData({
        foodName: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      })
    }
  }, [visible, slideAnim])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  })

  const handleSubmit = async () => {
    // Validation
    if (!formData.foodName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên món ăn')
      return
    }

    if (formData.calories <= 0) {
      Alert.alert('Lỗi', 'Calories phải lớn hơn 0')
      return
    }

    setLoading(true)
    try {
      await addManualMeal(formData)
      Alert.alert('Thành công', 'Đã thêm món ăn thành công!')
      onDismiss()
      onSuccess?.()
    } catch (error: any) {
      console.error('Error adding manual meal:', error)
      Alert.alert('Lỗi', error.message || 'Không thể thêm món ăn')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: keyof ManualMealData, value: string) => {
    if (field === 'foodName') {
      setFormData(prev => ({ ...prev, [field]: value }))
    } else {
      const numValue = parseFloat(value) || 0
      setFormData(prev => ({ ...prev, [field]: numValue }))
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
                    <Text style={styles.headerTitle}>Manual Entry</Text>
                    <Text style={styles.headerSubtitle}>Enter meal details</Text>
                  </View>
                  <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                    <MaterialCommunityIcons name="close" size={24} color="#999" />
                  </TouchableOpacity>
                </View>

                {/* Form */}
                <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
                  {/* Food Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên món ăn *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="food" size={20} color="#00BDD4" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="VD: Cơm gà"
                        value={formData.foodName}
                        onChangeText={(value) => updateField('foodName', value)}
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Calories */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Calories (kcal) *</Text>
                    <View style={styles.inputWrapper}>
                      <MaterialCommunityIcons name="fire" size={20} color="#FF6B9D" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="VD: 450"
                        value={formData.calories > 0 ? formData.calories.toString() : ''}
                        onChangeText={(value) => updateField('calories', value)}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>

                  {/* Macros Row */}
                  <View style={styles.macrosRow}>
                    {/* Protein */}
                    <View style={[styles.inputGroup, styles.macroInput]}>
                      <Text style={styles.label}>Protein (g)</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="arm-flex" size={18} color="#E67676" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="25"
                          value={formData.protein > 0 ? formData.protein.toString() : ''}
                          onChangeText={(value) => updateField('protein', value)}
                          keyboardType="numeric"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>

                    {/* Carbs */}
                    <View style={[styles.inputGroup, styles.macroInput]}>
                      <Text style={styles.label}>Carbs (g)</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="bread-slice" size={18} color="#00BDD4" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="60"
                          value={formData.carbs > 0 ? formData.carbs.toString() : ''}
                          onChangeText={(value) => updateField('carbs', value)}
                          keyboardType="numeric"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>

                    {/* Fat */}
                    <View style={[styles.inputGroup, styles.macroInput]}>
                      <Text style={styles.label}>Fat (g)</Text>
                      <View style={styles.inputWrapper}>
                        <MaterialCommunityIcons name="water" size={18} color="#E8956A" style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="12"
                          value={formData.fat > 0 ? formData.fat.toString() : ''}
                          onChangeText={(value) => updateField('fat', value)}
                          keyboardType="numeric"
                          placeholderTextColor="#999"
                        />
                      </View>
                    </View>
                  </View>

                  {/* Info Note */}
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#00BDD4" />
                    <Text style={styles.infoText}>
                      * là bắt buộc. Macros (Protein, Carbs, Fat) là tùy chọn
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
                    {loading ? 'Đang thêm...' : 'Thêm món ăn'}
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
  macrosRow: {
    flexDirection: "row",
    gap: 12,
  },
  macroInput: {
    flex: 1,
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
