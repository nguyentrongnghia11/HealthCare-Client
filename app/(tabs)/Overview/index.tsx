import { ScrollView, StyleSheet, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import Header from "../../../components/overview/Header"
import Overview from "../../../components/overview/Overview"
import Highlights from "../../../components/overview/Highlights"
import ThisWeekReport from "../../../components/overview/ThisWeekReport"
import Blogs from "../../../components/overview/Blogs"

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Overview />
        <Highlights />
        <ThisWeekReport />
        <Blogs />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
})

export default App
