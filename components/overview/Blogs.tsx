import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useRouter } from "expo-router";
import { getPosts } from '../../api/posts'

export default function Blogs() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const blogData = [
    {
      id: 1,
      title: "More about Apples: Benefits, nutrition, and tips",
      category: "Nutrition",
      votes: "76 votes",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop",
      backgroundColor: "#FF6B6B",
    },
    {
      id: 2,
      title: "The simple way to manage your health",
      category: "Lifestyle",
      votes: "54 votes",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      backgroundColor: "#2C5F5D",
    },
  ]
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getPosts()
        if (mounted && Array.isArray(data)) setPosts(data)
      } catch (err) {
        console.error('Failed to load blog posts', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleViewMore = () => {
    router.push("/(tabs)/Overview/BlogListScreen");
  };
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Blogs</Text>
        <TouchableOpacity onPress={handleViewMore}>
          <Text style={styles.viewMore}>View more →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {(posts && posts.length > 0 ? posts.slice(0, 2) : blogData).map((blog: any) => (
          <TouchableOpacity
            key={blog._id || blog.id}
            style={styles.blogCard}
            activeOpacity={0.8}
            onPress={() => {
              const id = blog.id || blog._id
              if (id) router.push({ pathname: '/(tabs)/Overview/BlogDetailScreen', params: { id } })
            }}
          >
            <View style={[styles.imageContainer, { backgroundColor: blog.backgroundColor || '#ddd' }] }>
              <Image source={{ uri: blog.image || blog.imageUrl }} style={styles.blogImage} />
            </View>
            <View style={styles.blogContent}>
              <Text style={styles.blogCategory}>{blog.category || blog.excerpt}</Text>
              <Text style={styles.blogTitle}>{blog.title}</Text>
              <View style={styles.blogFooter}>
                <Text style={styles.blogVotes}>👍 {blog.votes || ''}</Text>
                <TouchableOpacity onPress={() => {
                  const id = blog.id || blog._id
                  if (id) router.push({ pathname: '/(tabs)/Overview/BlogDetailScreen', params: { id } })
                }}>
                  <Text style={styles.tellMeMore}>Tell me more →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27b315",
  },
  viewMore: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },
  scrollContainer: {
    paddingRight: 20,
  },
  blogCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
  },
  imageContainer: {
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  blogContent: {
    padding: 16,
  },
  blogCategory: {
    fontSize: 12,
    color: "#666666",
    fontWeight: "500",
    marginBottom: 8,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    lineHeight: 22,
    marginBottom: 12,
  },
  blogFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  blogVotes: {
    fontSize: 12,
    color: "#00BFFF",
    fontWeight: "500",
  },
  tellMeMore: {
    fontSize: 12,
    color: "#00BFFF",
    fontWeight: "500",
  },
})