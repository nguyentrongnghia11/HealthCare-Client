import { StyleSheet, TouchableOpacity, View } from "react-native";


export default function Header() {

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.homeIcon} >
          <View style={styles.homeIconShape} />
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
