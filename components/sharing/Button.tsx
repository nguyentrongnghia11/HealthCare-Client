import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ButtonProps {
  title: string
  onPress: () => void
  variant: "primary" | "secondary"
  icon?: string
}

export default function Button({ title, onPress, variant, icon }: ButtonProps) {
  const isPrimary = variant === "primary"

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isPrimary ? styles.primaryButton : styles.secondaryButton]}
      activeOpacity={0.8}
    >
      {icon && <Ionicons name={icon as any} size={20} color={isPrimary ? "#fff" : "#111"} style={styles.icon} />}
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  primaryButton: {
    backgroundColor: "#06b6d4",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#111",
  },
})
