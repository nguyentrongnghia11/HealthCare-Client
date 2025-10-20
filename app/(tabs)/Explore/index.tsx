import { ScrollView, StyleSheet, Text } from 'react-native';

export default function TabOneScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text>Ngõ chía lộn tên nè, bên này mới là explore</  Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // tương ứng bg-background
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  metricsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 12, // React Native 0.71+ hỗ trợ gap, nếu không thì dùng marginBottom cho từng item
  },
});