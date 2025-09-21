import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.statusIcons}>
          <View style={styles.signalBars}>
            <View style={[styles.bar, styles.bar1]} />
            <View style={[styles.bar, styles.bar2]} />
            <View style={[styles.bar, styles.bar3]} />
            <View style={[styles.bar, styles.bar4]} />
          </View>
          <View style={styles.wifi} />
          <View style={styles.battery} />
        </View>
      </View>

      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.homeIcon}>
          <View style={styles.homeIconShape} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
            }}
            style={styles.profileImage}
          />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingTop: 10,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  time: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  statusIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginRight: 8,
  },
  bar: {
    width: 3,
    backgroundColor: "#000000",
    marginRight: 2,
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  wifi: {
    width: 15,
    height: 15,
    backgroundColor: "#000000",
    borderRadius: 2,
    marginRight: 8,
  },
  battery: {
    width: 24,
    height: 12,
    backgroundColor: "#000000",
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  homeIcon: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIconShape: {
    width: 20,
    height: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 4,
  },
  profileContainer: {
    position: "relative",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    backgroundColor: "#4CAF50",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
})
