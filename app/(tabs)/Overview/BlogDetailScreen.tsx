import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useLocalSearchParams, useRouter } from "expo-router"

const API_URL = 'http://192.168.1.3:3000/posts'

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

export default function BlogDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const [post, setPost] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`)
        if (res.status === 404) {
          if (mounted) setPost(null)
          return
        }
        const data = await res.json()
        if (mounted) setPost(data)
      } catch (err) {
        console.error('Failed to load post', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (id) fetchPost()
    return () => { mounted = false }
  }, [id])

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace("/(tabs)/Overview/BlogListScreen")
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaView>
    )
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
          <TouchableOpacity style={styles.ctaButton} onPress={() => router.replace("/(tabs)/Overview/BlogListScreen") }>
            <Text style={styles.ctaButtonText}>Về trang chủ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const contentParagraphs = (post.content || '').split("\n\n").filter((p: string) => p.trim())

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
              {post.date ? new Date(post.date).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : ''}
            </Text>

            <Text style={styles.title}>{post.title}</Text>

            <Text style={styles.excerpt}>{post.excerpt}</Text>

            {contentParagraphs.map((paragraph: string, index: number) => (
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
