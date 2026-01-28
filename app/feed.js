import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Feed() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>

      <ScrollView>
        <View style={styles.post}>
          <Text style={styles.user}>@user</Text>
          <Text style={styles.content}>Hello from the mobile app 👋</Text>
        </View>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => router.push("/create-post")}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: { color: "#fff", fontSize: 24, marginBottom: 16, fontWeight: "bold" },
  post: {
    borderBottomWidth: 1,
    borderBottomColor: "#2f3336",
    paddingVertical: 12,
  },
  user: { color: "#1da1f2", marginBottom: 4 },
  content: { color: "#fff" },
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
  plus: { color: "#fff", fontSize: 32 },
});
