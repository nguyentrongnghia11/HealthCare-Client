import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"
import { BlurView } from "expo-blur"
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from "react"
import { Alert, Animated, Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { Surface, Text } from "react-native-paper"

import { uploadImage } from "../api/nutrition"
import { ManualEntryModal } from "./ManualEntryModal"

interface NutritionData {
  consumed: number
  total: number
  percentage: number
  fat: { value: number; percentage: number }
  protein: { value: number; percentage: number }
  carbs: { value: number; percentage: number }
}

interface AddMealModalProps {
  visible: boolean
  onDismiss: () => void,
  nutritionData: NutritionData,
  setNutritionData: any,
  onSuccess?: () => void
  isUploading?: boolean
  setIsUploading?: (value: boolean) => void
}

type IconName = "image-plus" | "camera" | "pencil"

interface MenuOption {
  id: string
  icon: IconName
  title: string
  subtitle: string
  color: string
  bgColor: string
  gradient1: string
  gradient2: string
}

const menuOptions: MenuOption[] = [
  {
    id: "upload",
    icon: "image-plus",
    title: "Upload Photo",
    subtitle: "Choose from your device",
    color: "#FF6B9D",
    bgColor: "#FFE5F0",
    gradient1: "#FF6B9D",
    gradient2: "#FF8AB3",
  },
  {
    id: "camera",
    icon: "camera",
    title: "Snap Photo",
    subtitle: "Capture meal instantly",
    color: "#26C6DA",
    bgColor: "#E0F7FA",
    gradient1: "#26C6DA",
    gradient2: "#00ACC1",
  },
  {
    id: "manual",
    icon: "pencil",
    title: "Manual Entry",
    subtitle: "Input details yourself",
    color: "#FFB74D",
    bgColor: "#FFF3E0",
    gradient1: "#FFB74D",
    gradient2: "#FFA726",
  },
]

export const AddMealModal: React.FC<AddMealModalProps> = ({ visible, onDismiss, nutritionData, setNutritionData, onSuccess, isUploading: externalIsUploading, setIsUploading: externalSetIsUploading }) => {
  const [slideAnim] = React.useState(new Animated.Value(0))
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const actualSetIsUploading = (value: boolean) => {
    setIsUploading(value);
    if (externalSetIsUploading) {
      externalSetIsUploading(value);
    }
  };

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
    }
  }, [visible, slideAnim])

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, 0],
  })

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Từ chối!', 'Rất tiếc, chúng tôi cần quyền truy cập camera để thực hiện việc này.');
      return;
    }
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        console.log('Ảnh đã chụp: ', imageUri);
        onDismiss();
        await handleUpload(imageUri);
      }
    } catch (error) {
      console.error('Lỗi khi mở camera: ', error);
      Alert.alert('Lỗi', 'Không thể mở camera.');
    }
  }


  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Từ chối!', 'Rất tiếc, chúng tôi cần quyền truy cập thư viện ảnh để thực hiện việc này.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        console.log('Ảnh đã chọn: ', imageUri);
        onDismiss();
        await handleUpload(imageUri);
      }
    } catch (error) {
      console.error('Lỗi khi mở thư viện: ', error);
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    }
  };

  const handleUpload = async (uri: string) => {
    actualSetIsUploading(true);
    try {
      const responseData = await uploadImage(uri);


      console.log('Upload thành công: ', responseData);

      const { ...newNutritionData } = nutritionData

      newNutritionData.carbs.value = Math.round((responseData.carbs || 0) + nutritionData.carbs.value);
      newNutritionData.carbs.percentage = Math.round((newNutritionData.carbs.value * 100) / 225);

      newNutritionData.protein.value = Math.round((responseData.protein || 0) + nutritionData.protein.value);
      newNutritionData.protein.percentage = Math.round((newNutritionData.protein.value * 100) / 150);

      newNutritionData.fat.value = Math.round((responseData.fat || 0) + nutritionData.fat.value);
      newNutritionData.fat.percentage = Math.round((newNutritionData.fat.value * 100) / 55);

      newNutritionData.consumed = Math.round(newNutritionData.consumed += responseData.calories);
      newNutritionData.percentage = Math.round((newNutritionData.consumed * 100) / 2000);

      console.log("new nutrition ", newNutritionData)

      setNutritionData(newNutritionData)
      Alert.alert('Thành công', 'Đã thêm món ăn thành công!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Lỗi khi upload: ', error);
      Alert.alert('Tải lên thất bại', 'Đã có lỗi xảy ra khi tải ảnh lên.');
    } finally {
      actualSetIsUploading(false);
    }
  };

  const handleOptionPress = (optionId: string) => {
    if (optionId === 'camera') {
      handleTakePhoto();
    } else if (optionId === 'upload') {
      handleChoosePhoto();
    } else if (optionId === 'manual') {
      onDismiss();
      setTimeout(() => {
        setShowManualEntry(true);
      }, 300);
    }
  };

  return (
    <>
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
                      <Text style={styles.headerTitle}>Add Your Meal</Text>
                      <Text style={styles.headerSubtitle}>Choose how you want to add</Text>
                    </View>
                    <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                      <MaterialCommunityIcons name="close" size={24} color="#999" />
                    </TouchableOpacity>
                  </View>

                  {/* Options */}
                  <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                    {menuOptions.map((option, index) => (
                      <TouchableOpacity
                        key={option.id}
                        onPress={() => handleOptionPress(option.id)}
                        activeOpacity={0.7}
                        style={{ marginBottom: index === menuOptions.length - 1 ? 0 : 12 }}
                      >
                        <Surface style={styles.optionCard} elevation={0}>
                          <View style={[styles.optionIcon, { backgroundColor: option.bgColor }]}>
                            <MaterialCommunityIcons name={option.icon} size={32} color={option.color} />
                          </View>

                          {/* Middle: Text */}
                          <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                          </View>

                          {/* Right: Arrow */}
                          <View style={[styles.arrow, { backgroundColor: option.bgColor }]}>
                            <MaterialCommunityIcons name="arrow-right" size={20} color={option.color} />
                          </View>
                        </Surface>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Footer Note */}
                  <View style={styles.footer}>
                    <MaterialCommunityIcons name="information-outline" size={16} color="#999" />
                    <Text style={styles.footerText}>Track meals daily to reach your nutrition goals</Text>
                  </View>
                </Surface>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>
      </Modal>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        visible={showManualEntry}
        onDismiss={() => setShowManualEntry(false)}
        onSuccess={() => {
          setShowManualEntry(false)
          onSuccess?.()
        }}
      />
    </>
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
    maxHeight: height * 0.8,
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
  optionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionText: {
    flex: 1,
    justifyContent: "center",
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(38, 198, 218, 0.05)",
    borderRadius: 12,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
})