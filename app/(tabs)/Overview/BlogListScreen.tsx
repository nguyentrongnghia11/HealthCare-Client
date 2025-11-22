import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter, Link } from "expo-router"
import back from '../../../assets/images/overview/back.png';

const API_URL = 'http://192.168.1.3:3000/posts'

export default function BlogListScreen() {
  const router = useRouter()

  const renderPostCard = ({ item }: { item: any }) => (
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

  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchPosts = async () => {
      try {
        const res = await fetch(API_URL)
        const data = await res.json()
        console.log('Fetched posts:', data);
        if (mounted) setBlogPosts(data)
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
        <Text style={styles.headerTitle}>Blog Của Tôi</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={blogPosts}
          renderItem={renderPostCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          scrollEventThrottle={16}
        />
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Blog của tôi. Tất cả quyền được bảo vệ.</Text>
      </View>
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
  headerButton: {
    padding: 8,
    width: 30,
    height: 30,
    marginBottom: 10,
  },
})