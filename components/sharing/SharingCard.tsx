import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

interface SharingCardProps {
  title: string
  description: string
  icon: string
  iconColor: string
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  "swap-horizontal": "swap-horizontal",
  shield: "shield",
  bell: "notifications",
}

export default function SharingCard({ title, description, icon, iconColor }: SharingCardProps) {
  const iconName = iconMap[icon] || "help-circle"

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})
