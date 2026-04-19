import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Archived() {
const [posts, setPosts] = useState<any[]>([]);

useEffect(() => {
const unsub = onSnapshot(collection(db, "posts"), (snap) => {
const data = snap.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setPosts(data);
});

return () => unsub();
}, []);

const archived = posts.filter(
(p) => p.status === "archived" || p.status === "resolved"
);

return (
<View style={styles.container}>
<Text style={styles.title}>Archived Posts</Text>

<FlatList
data={archived}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.card}>
<Text style={styles.titleText}>{item.title}</Text>
<Text>{item.description}</Text>

<Text>Status: {item.status}</Text>
</View>
)}
/>
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 20 },
title: { fontSize: 22, fontWeight: "bold" },
card: {
backgroundColor: "white",
padding: 12,
marginTop: 10,
borderRadius: 10,
},
titleText: { fontWeight: "bold" },
});
