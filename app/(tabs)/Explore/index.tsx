import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { getPosts } from '../../../api/posts';

const ExploreScreen = () => {
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getPosts()
          console.log("Fetched posts for Explore:", data);
        if (mounted && Array.isArray(data)) setPosts(data)
      } catch (err) {
        console.error('Failed to load posts for Explore', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const categories = [
    { id: "1", icon: "apple-alt", label: "Nutrition", type: "nutrition", color: "#E0F7E9" },
    { id: "2", icon: "futbol", label: "Sport", type: "sport", color: "#E6F0FF" },
    { id: "3", icon: "dumbbell", label: "Workout", type: "work_out", color: "#FFF0F5" },
  ];

  const blogs = posts && posts.length > 0 ? posts : [
    {
      id: "1",
      title: "More about Apples: Benefits, nutrition, and tips",
      category: "Nutrition",
      image:
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=60",
      votes: 78,
    },
    {
      id: "2",
      title: "The secret of effective morning workout",
      category: "Lifestyle",
      image:
        "https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?auto=format&fit=crop&w=800&q=60",
      votes: 54,
    },
  ];

  // Filter blogs based on selected category and search query
  const filteredBlogs = blogs.filter(blog => {
    // Filter by category
    const matchesCategory = selectedCategory 
      ? (blog.type || '').toLowerCase() === selectedCategory.toLowerCase()
      : true;
    
    // Filter by search query
    const matchesSearch = searchQuery
      ? (blog.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (item: { id: string; label: string; type: string }) => {
    console.log("Category clicked:", item.label);
    // Toggle category selection
    if (selectedCategory === item.type) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(item.type); // Select category to filter posts
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search bar */}
      <View style={styles.header}>
        <TextInput
          mode="outlined"
          placeholder="Search topic"
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="magnify" />}
          right={searchQuery ? <TextInput.Icon icon="close" onPress={() => setSearchQuery('')} /> : undefined}
          style={styles.searchInput}
          outlineStyle={{ borderWidth: 0 }}
        />
      </View>

      {/* For You section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>For you</Text>
      </View>

      <View style={styles.categoryContainer}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.categoryItem, 
              { backgroundColor: item.color },
              selectedCategory === item.type && styles.categoryItemSelected
            ]}
            activeOpacity={0.7}
            onPress={() => handleCategoryPress(item)}
          >
            <FontAwesome5 name={item.icon as any} size={24} color="#000" />
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

      </View>

      {/* Newest Blogs */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${categories.find(c => c.type === selectedCategory)?.label} Blogs` : 'Newest blogs'}
        </Text>
        <TouchableOpacity onPress={() => setSelectedCategory(null)}>
          <Text style={styles.viewMore}>
            {selectedCategory ? 'Clear filter' : 'View more ›'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={filteredBlogs}
        keyExtractor={(item) => (item._id || item.id).toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.blogCard}
            activeOpacity={0.8}
            onPress={() => {
              const id = item.id || item._id
              if (id) router.push({ pathname: '/(tabs)/Overview/BlogDetailScreen', params: { id } })
            }}
          >
            <Image source={{ uri: item.image || item.imageUrl }} style={styles.blogImage} />
            <View style={styles.blogContent}>
              <Text style={styles.blogCategory} numberOfLines={1}>{item.category || item.excerpt}</Text>
              <Text style={styles.blogTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.blogVotes}>{item.votes ? `💙 ${item.votes} votes` : ''}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No blogs found for "{selectedCategory}"</Text>
          </View>
        }
      />
    </ScrollView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    borderRadius: 10,
  },
  avatarContainer: {
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: "#22C55E",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  viewMore: {
    color: "#6B7280",
    fontSize: 14,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  categoryItemSelected: {
    borderWidth: 2,
    borderColor: "#22C55E",
  },
  categoryLabel: {
    marginTop: 6,
    fontWeight: "500",
  },
  blogCard: {
    width: 220,
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  blogImage: {
    width: "100%",
    height: 120,
  },
  blogContent: {
    padding: 12,
    flex: 1,
  },
  blogCategory: {
    fontSize: 13,
    color: "#6B7280",
  },
  blogTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginVertical: 4,
  },
  blogVotes: {
    fontSize: 13,
    color: "#3B82F6",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
