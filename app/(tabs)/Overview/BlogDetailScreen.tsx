import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"
const blogPosts = [
  {
    id: 1,
    title: "Bắt đầu với React",
    excerpt: "Học cách xây dựng giao diện người dùng hiện đại với React.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop",
    date: "2024-01-15",
    content: `React là một thư viện JavaScript mạnh mẽ để xây dựng giao diện người dùng. 

Trong bài viết này, chúng ta sẽ khám phá các khái niệm cơ bản của React:

1. Components - Các khối xây dựng của React
2. JSX - Cú pháp mở rộng của JavaScript
3. State và Props - Quản lý dữ liệu trong React
4. Hooks - Cách sử dụng state trong functional components

React cho phép bạn tạo các ứng dụng web tương tác một cách dễ dàng. Bằng cách sử dụng các component, bạn có thể chia nhỏ giao diện người dùng thành các phần nhỏ, dễ quản lý.

Hook là một tính năng tuyệt vời trong React cho phép bạn sử dụng state và các tính năng khác mà không cần viết một class component.

Hãy bắt đầu học React ngay hôm nay!`,
  },
  {
    id: 2,
    title: "Next.js cho người mới bắt đầu",
    excerpt: "Khám phá framework Next.js và tạo ứng dụng toàn stack.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    date: "2024-01-20",
    content: `Next.js là một framework React mạnh mẽ cho phép bạn tạo ứng dụng toàn stack một cách dễ dàng.

Các tính năng chính của Next.js:

1. Server-side Rendering (SSR) - Render trang trên máy chủ để SEO tốt hơn
2. Static Site Generation (SSG) - Tạo trang tĩnh cho hiệu suất cao
3. API Routes - Tạo API backend trực tiếp trong dự án
4. File-based Routing - Cấu trúc đơn giản cho routing

Với Next.js, bạn có thể xây dựng ứng dụng web hiện đại với hiệu suất cao và trải nghiệm nhà phát triển tuyệt vời.

App Router là một tính năng mới trong Next.js 13+ cho phép bạn quản lý routing một cách linh hoạt hơn.

Hãy bắt đầu dự án Next.js đầu tiên của bạn ngay bây giờ!`,
  },
  {
    id: 3,
    title: "Tailwind CSS - Viết CSS nhanh hơn",
    excerpt: "Sử dụng utility classes để tạo giao diện đẹp mà không cần viết CSS truyền thống.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop",
    date: "2024-01-25",
    content: `Tailwind CSS là một framework CSS tiện ích-first giúp bạn viết CSS nhanh hơn.

Thay vì viết CSS truyền thống, Tailwind cung cấp các lớp tiện ích nhỏ mà bạn có thể kết hợp để tạo bất kỳ thiết kế nào.

Ưu điểm của Tailwind CSS:

1. Nhanh chóng - Viết CSS mà không phải rời khỏi HTML
2. Responsive - Hỗ trợ thiết kế đáp ứng dễ dàng
3. Tùy biến - Dễ dàng tùy chỉnh theo thương hiệu của bạn
4. Hiệu suất - Tệp CSS chỉ chứa các lớp được sử dụng

Tailwind CSS đã trở thành lựa chọn yêu thích của nhiều nhà phát triển web. Nó giúp tăng tốc độ phát triển đáng kể.

Bắt đầu với Tailwind CSS trong dự án tiếp theo của bạn!`,
  },
  {
    id: 4,
    title: "TypeScript tips & tricks",
    excerpt: "Những mẹo hay để viết TypeScript hiệu quả và tránh lỗi.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&h=400&fit=crop",
    date: "2024-02-01",
    content: `TypeScript là một siêu tập hợp của JavaScript cung cấp kiểu tĩnh.

Các mẹo hay khi làm việc với TypeScript:

1. Sử dụng interface cho các đối tượng
2. Sử dụng type guards để kiểm tra loại
3. Sử dụng generics để viết mã có thể tái sử dụng
4. Sử dụng enums cho các hằng số

TypeScript giúp bạn viết mã an toàn hơn bằng cách cung cấp kiểm tra loại tại thời điểm biên dịch.

Mặc dù có một đường cong học tập, TypeScript sẽ giúp bạn viết mã tốt hơn và bắt lỗi sớm hơn.

Hãy khám phá TypeScript ngay hôm nay và nâng cao kỹ năng lập trình của bạn!`,
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#e2e8f0",
  },
  article: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  contentContainer: {
    padding: 20,
  },
  postDate: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    lineHeight: 36,
  },
  excerpt: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 16,
  },
  contentParagraph: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    marginBottom: 16,
  },
  ctaSection: {
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    marginTop: 24,
    paddingTop: 20,
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
    textAlign: "center",
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

export default function BlogDetailScreen({ route, navigation }: { route: { params: { id: number } }; navigation: { goBack: () => void; navigate: (screen: string) => void } }) {
  const router = useRouter()
  
  // 2. Lấy ID từ params (Lưu ý: id nhận được luôn là chuỗi string)
  const { id } = useLocalSearchParams()

  // 3. Tìm bài viết (Phải ép kiểu id về Number vì params trả về String)
  const post = blogPosts.find((p) => p.id === Number(id))

  // Xử lý nút Back
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      // Nếu không back được thì về lại trang list (tên file list của bạn)
      router.replace("/BlogListScreen" as any)
    }
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundTitle}>Bài viết không tìm thấy</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("BlogList")}>
            <Text style={styles.ctaButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const contentParagraphs = post.content.split("\n\n").filter((p) => p.trim())

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: post.image }} style={styles.heroImage} />

        <View style={styles.article}>
          <View style={styles.contentContainer}>
            <Text style={styles.postDate}>
              {new Date(post.date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <Text style={styles.title}>{post.title}</Text>

            <Text style={styles.excerpt}>{post.excerpt}</Text>

            {contentParagraphs.map((paragraph, index) => (
              <Text key={index} style={styles.contentParagraph}>
                {paragraph}
              </Text>
            ))}

            <View style={styles.ctaSection}>
              <TouchableOpacity style={styles.ctaButton} onPress={handleBack}>
                <Text style={styles.ctaButtonText}>← Xem bài viết khác</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Blog của tôi. Tất cả quyền được bảo vệ.</Text>
      </View>
    </SafeAreaView>
  )
}
