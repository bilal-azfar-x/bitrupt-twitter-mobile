import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { supabase } from "../supabase";

export default function CreatePost() {
  const router = useRouter();
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>

      <TextInput
        style={styles.input}
        placeholder="What's happening?"
        placeholderTextColor="#8899a6"
        multiline
        value={text}
        onChangeText={setText}
      />

      <Pressable
        style={styles.button}
        onPress={async () => {
          const { data } = await supabase.auth.getUser();

          if (!data.user) {
            alert("You must be logged in");
            return;
          }

          const { error } = await supabase.from("posts").insert({
            content: text,
            user_id: data.user.id,
            user_email: data.user.email,
          });

          if (error) {
            alert(error.message);
          } else {
            router.back();
          }
        }}
      >
        <Text style={styles.buttonText}>Post</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 24 },
  title: { color: "#fff", fontSize: 24, marginBottom: 16, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#2f3336",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    height: 120,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#1da1f2",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
