import { ScrollView, StatusBar, StyleSheet, View } from "react-native"

import Blogs from "../../../components/overview/Blogs"
import Highlights from "../../../components/overview/Highlights"
import Overview from "../../../components/overview/Overview"
import ThisWeekReport from "../../../components/overview/ThisWeekReport"
import { Colors, useTheme } from "../../../contexts/ThemeContext"

const App = () => {
  const { isDark } = useTheme()
  const colors = isDark ? Colors.dark : Colors.light
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Overview />
        <Highlights />
        <ThisWeekReport />
        <Blogs />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
     paddingHorizontal: 20,
  },
})

export default App
