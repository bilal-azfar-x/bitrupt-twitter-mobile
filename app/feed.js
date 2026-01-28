import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Feed() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, user_email, content, created_at")
        .order("created_at", { ascending: false });

      if (!error && isMounted) {
        setPosts(data || []);
      }

      if (isMounted) setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/");
        } else {
          fetchPosts();
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading feed...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>

      <Text style={styles.title}>Feed</Text>

      <ScrollView>
        {posts.length === 0 && (
          <Text style={styles.emptyText}>No posts yet.</Text>
        )}

        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <Text style={styles.user}>
              @{post.user_email ? post.user_email.split("@")[0] : "anonymous"}
            </Text>
            <Text style={styles.content}>{post.content}</Text>
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push("/create-post")}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  logoutButton: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  logoutText: {
    color: "#1da1f2",
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#8899a6",
    textAlign: "center",
    marginTop: 20,
  },
  post: {
    borderBottomWidth: 1,
    borderBottomColor: "#2f3336",
    paddingVertical: 12,
  },
  user: {
    color: "#1da1f2",
    marginBottom: 4,
  },
  content: {
    color: "#fff",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#1da1f2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  plus: {
    color: "#fff",
    fontSize: 32,
  },
});
