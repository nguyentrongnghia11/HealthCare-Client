import { StyleSheet, Text, View } from "react-native"
import Button from "../../../components/sharing/Button"
import SharingCard from "../../../components/sharing/SharingCard"

export default function SharingScreen() {
  const sharingFeatures = [
    {
      id: 1,
      title: "Keep your health in check",
      description: "Keep loved ones informed about your condition.",
      icon: "swap-horizontal",
      iconColor: "#FF6B6B",
    },
    {
      id: 2,
      title: "Protect your privacy",
      description: "Share key conclusions. Stop anytime.",
      icon: "shield",
      iconColor: "#9B7FFF",
    },
    {
      id: 3,
      title: "Notifications",
      description: "Get notified of updates to shared dashboards.",
      icon: "bell",
      iconColor: "#00BCD4",
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sharing</Text>

      <View style={styles.cardsContainer}>
        {sharingFeatures.map((feature) => (
          <SharingCard
            key={feature.id}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            iconColor={feature.iconColor}
          />
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Start sharing"
          onPress={() => console.log("Start sharing pressed")}
          variant="primary"
          icon="share-2"
        />
        <Button title="Setting" onPress={() => console.log("Setting pressed")} variant="secondary" icon="settings" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  buttonsContainer: {
    gap: 12,
  },
})
