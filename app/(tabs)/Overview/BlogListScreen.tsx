import { Link, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlogPost, getBlogPosts } from '../../../api/overview';
import back from '../../../assets/images/overview/back.png';
import { getPosts } from '../../../api/posts'

export default function BlogListScreen() {
  const router = useRouter()

  // Helper: sort posts by date (newest first)
  const sortPosts = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    const toTime = (it: any) => {
      const d = it?.date || it?.createdAt || '';
      const t = Date.parse(d);
      return isNaN(t) ? 0 : t;
    };
    return arr.slice().sort((a, b) => toTime(b) - toTime(a));
  }

  // Post types and client-side filter state
  const POST_TYPES = [
    { value: 'all', label: 'Tất cả' },
    { value: 'nutrition', label: 'Nutrition' },
    { value: 'sport', label: 'Sport' },
    { value: 'work_out', label: 'Work Out' }
  ];
  const [typeFilter, setTypeFilter] = useState('all')

  const renderPostCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postCard} onPress={() => handlePostPress(item.id || (item as any)._id)} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postDate}>{new Date(item.date).toLocaleDateString("vi-VN")}</Text>
        <Text style={styles.postTitle}>{item.title}</Text>
        {item.type ? <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 6, textTransform: 'capitalize' }}>{item.type.replace('_',' ')}</Text> : null}
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

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  // Apply client-side type filter
  const displayedPosts = typeFilter === 'all' ? blogPosts : blogPosts.filter(p => (p as any).type === typeFilter)

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts()

        // Cast to any to inspect possible shapes safely
        const raw: any = data
        // Normalize response: support direct array, { data: [...] }, or { posts: [...] }
        let postsArray: any[] = []
        if (Array.isArray(raw)) postsArray = raw
        else if (raw && Array.isArray(raw.data)) postsArray = raw.data
        else if (raw && Array.isArray(raw.posts)) postsArray = raw.posts
        else postsArray = []

        if (mounted) setBlogPosts(sortPosts(postsArray))
      } catch (err) {
        console.error('Failed to load posts', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPosts()
    return () => { mounted = false }
  }, [])
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Link href="./" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Image source={back} style={styles.headerButton} />
          </TouchableOpacity>
        </Link>
        <Text style={styles.headerTitle}>My Blog</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <>
          <View style={{ flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, gap: 8 }}>
            {POST_TYPES.map(t => (
              <TouchableOpacity key={t.value} onPress={() => setTypeFilter(t.value)} style={{ paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: typeFilter === t.value ? '#2563eb' : '#eef2ff' }}>
                <Text style={{ color: typeFilter === t.value ? '#fff' : '#2563eb', fontWeight: '600' }}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={displayedPosts}
            renderItem={renderPostCard}
            keyExtractor={(item, index) => ((item.id || (item as any)._id) || index).toString()}
            contentContainerStyle={styles.content}
            scrollEventThrottle={16}
          />
        </>
      )}

    </SafeAreaView>
  )
}

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
    flexDirection: "row",
    alignItems: "center",
    
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
    alignItems: "center",
    flex: 1,
    textAlign: "center",
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
  headerButton: {
    padding: 8,
    width: 30,
    height: 30,
    marginBottom: 10,
  },
})