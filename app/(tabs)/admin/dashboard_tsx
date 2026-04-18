import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

type Post = {
id: string;
title?: string;
description?: string;
status?: "pending" | "in_progress" | "resolved" | "open";
location?: {
area?: string;
};
likes?: any[];
comments?: any[];
};

export default function AdminDashboard() {
const [posts, setPosts] = useState<Post[]>([]);
const [selectedArea, setSelectedArea] = useState<string | null>(null);

useEffect(() => {
const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
const data = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
})) as Post[];

setPosts(data);
});

return () => unsub();
}, []);

// 🔥 update status
const updateStatus = async (id: string, status: Post["status"]) => {
await updateDoc(doc(db, "posts", id), { status });
};

// 📊 GLOBAL STATS
const totalPosts = posts.length;
const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

// 📍 GROUP BY AREA
const areas: Record<string, Post[]> = {};

posts.forEach((post) => {
const area = post.location?.area || "Unknown";
if (!areas[area]) areas[area] = [];
areas[area].push(post);
});

const areaList = Object.keys(areas);

// 👉 AREA VIEW
if (selectedArea) {
return (
<View style={styles.container}>
<Pressable onPress={() => setSelectedArea(null)}>
<Text style={styles.back}>← Back</Text>
</Pressable>

<Text style={styles.title}>{selectedArea} Posts</Text>

<FlatList
data={areas[selectedArea]}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.card}>
<Text style={styles.postTitle}>
{item.title || "No title"}
</Text>

<Text>{item.description}</Text>

{/* 🔥 FIX: normalize status display */}
<Text style={styles.status}>
Status: {item.status === "open" ? "pending" : item.status || "pending"}
</Text>

<Text>❤️ {item.likes?.length || 0}</Text>
<Text>💬 {item.comments?.length || 0}</Text>

{/* STATUS BUTTONS */}
<View style={styles.buttons}>
<Pressable onPress={() => updateStatus(item.id, "pending")}>
<Text style={styles.btn}>Pending</Text>
</Pressable>

<Pressable onPress={() => updateStatus(item.id, "in_progress")}>
<Text style={styles.btn}>In Progress</Text>
</Pressable>

<Pressable onPress={() => updateStatus(item.id, "resolved")}>
<Text style={styles.btn}>Resolved</Text>
</Pressable>
</View>
</View>
)}
/>
</View>
);
}

// 👉 MAIN DASHBOARD
return (
<View style={styles.container}>
<Text style={styles.title}>Admin Dashboard</Text>

{/* STATS */}
<View style={styles.stats}>
<Text>Total Posts: {totalPosts}</Text>
<Text>Total Likes: {totalLikes}</Text>
<Text>Total Comments: {totalComments}</Text>
<Text>Areas: {areaList.length}</Text>
</View>

{/* AREAS */}
<FlatList
data={areaList}
keyExtractor={(item) => item}
renderItem={({ item }) => (
<Pressable
style={styles.areaCard}
onPress={() => setSelectedArea(item)}
>
<Text style={styles.areaText}>{item}</Text>
<Text>{areas[item].length} posts</Text>
</Pressable>
)}
/>
</View>
);
}

const styles = StyleSheet.create({
container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
back: { color: "blue", marginBottom: 10 },

stats: {
backgroundColor: "white",
padding: 10,
borderRadius: 10,
marginBottom: 10,
},

areaCard: {
backgroundColor: "white",
padding: 15,
marginBottom: 10,
borderRadius: 10,
},

areaText: {
fontSize: 16,
fontWeight: "bold",
},

card: {
backgroundColor: "white",
padding: 12,
marginBottom: 10,
borderRadius: 10,
},

postTitle: {
fontSize: 16,
fontWeight: "bold",
},

status: {
marginTop: 5,
fontWeight: "bold",
color: "blue",
},

buttons: {
flexDirection: "row",
justifyContent: "space-between",
marginTop: 10,
},

btn: {
backgroundColor: "#333",
color: "white",
padding: 5,
borderRadius: 5,
overflow: "hidden",
},
});

