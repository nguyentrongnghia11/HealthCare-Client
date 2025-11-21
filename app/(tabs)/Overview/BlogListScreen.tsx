import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
const blogPosts = [
  {
    id: 1,
    title: "Bắt đầu với React",
    excerpt: "Học cách xây dựng giao diện người dùng hiện đại với React.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    date: "2024-01-15",
  },
  {
    id: 2,
    title: "Next.js cho người mới bắt đầu",
    excerpt: "Khám phá framework Next.js và tạo ứng dụng toàn stack.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    date: "2024-01-20",
  },
  {
    id: 3,
    title: "Tailwind CSS - Viết CSS nhanh hơn",
    excerpt: "Sử dụng utility classes để tạo giao diện đẹp mà không cần viết CSS truyền thống.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    date: "2024-01-25",
  },
  {
    id: 4,
    title: "TypeScript tips & tricks",
    excerpt: "Những mẹo hay để viết TypeScript hiệu quả và tránh lỗi.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
    date: "2024-02-01",
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#e2e8f0",
  },
  postContent: {
    padding: 16,
  },
  postDate: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  postExcerpt: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  postFooter: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  footer: {
    backgroundColor: "#1e293b",
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  footerText: {
    color: "#ffffff",
    fontSize: 14,
  },
})

export default function BlogListScreen() {
  const router = useRouter()

  const renderPostCard = ({ item }: { item: typeof blogPosts[0] }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item.id)} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postDate}>{new Date(item.date).toLocaleDateString("vi-VN")}</Text>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>
      </View>
      <View style={styles.postFooter}>
        <Text style={styles.readMoreText}>Đọc tiếp →</Text>
      </View>
    </TouchableOpacity>
  )

  const handlePostPress = (postId: any) => {
    console.log("Post ID:", postId)
    router.push({
      pathname: "/(tabs)/Overview/BlogDetailScreen",
      params: { id: postId }
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog Của Tôi</Text>
        <Text style={styles.headerSubtitle}>Chia sẻ những kiến thức về lập trình web</Text>
      </View>

      <FlatList
        data={blogPosts}
        renderItem={renderPostCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Blog của tôi. Tất cả quyền được bảo vệ.</Text>
      </View>
    </SafeAreaView>
  )
}
