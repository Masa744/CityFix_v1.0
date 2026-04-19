import { useEffect, useState } from "react";
import {
View,
Text,
Pressable,
StyleSheet,
FlatList,
Image,
TextInput,
Alert,
} from "react-native";

import { router } from "expo-router";

import { db, auth } from "../lib/firebase";

import {
collection,
onSnapshot,
orderBy,
query,
doc,
updateDoc,
arrayUnion,
arrayRemove,
getDoc,
deleteDoc,
} from "firebase/firestore";

import { signOut } from "firebase/auth";

export default function Home() {
const user = auth.currentUser;

const [posts, setPosts] = useState<any[]>([]);
const [commentText, setCommentText] = useState<any>({});
const [name, setName] = useState("");

const [cityFilter, setCityFilter] = useState("");
const [areaFilter, setAreaFilter] = useState("");
const [countyFilter, setCountyFilter] = useState("");

// GET USER NAME
useEffect(() => {
const fetchName = async () => {
if (!user) return;

const ref = doc(db, "users", user.uid);
const snap = await getDoc(ref);

if (snap.exists()) {
setName(snap.data().name);
}
};

fetchName();
}, []);

// REAL-TIME POSTS
useEffect(() => {
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

const unsubscribe = onSnapshot(q, (snapshot) => {
const data = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setPosts(data);
});

return () => unsubscribe();
}, []);

// LIKE
const toggleLike = async (postId: string, likes: any = []) => {
const postRef = doc(db, "posts", postId);

const safeLikes = Array.isArray(likes) ? likes : [];

const hasLiked = safeLikes.includes(user?.email || "");

await updateDoc(postRef, {
likes: hasLiked
? arrayRemove(user?.email)
: arrayUnion(user?.email),
});
};

// COMMENT
const addComment = async (postId: string) => {
const text = commentText[postId];
if (!text) return;

const postRef = doc(db, "posts", postId);

await updateDoc(postRef, {
comments: arrayUnion({
user: name || user?.email,
text,
}),
});

setCommentText((prev: any) => ({ ...prev, [postId]: "" }));
};

// DELETE POST
const deletePost = async (postId: string) => {
Alert.alert("Delete Post?", "This cannot be undone.", [
{ text: "Cancel", style: "cancel" },
{
text: "Delete",
style: "destructive",
onPress: async () => {
await deleteDoc(doc(db, "posts", postId));
},
},
]);
};

// FILTER (kept for future use)
const visiblePosts = posts.filter(
(post) => post.status !== "archived"
);

return (
<View style={styles.container}>

{/* HEADER */}
<View style={{ flex: 1 }}>
<Text style={styles.title}>
Welcome {name || user?.email || "User"}
</Text>

<Pressable
style={styles.button}
onPress={() => router.push("/create-post")}
>
<Text style={styles.buttonText}>Create Post</Text>
</Pressable>

<Pressable
style={styles.button}
onPress={() => router.push("/profile")}
>
<Text style={styles.buttonText}>Profile</Text>
</Pressable>

<Pressable
style={styles.button}
onPress={() => router.push("/filter")}
>
<Text style={styles.buttonText}>Filter Posts</Text>
</Pressable>

{/* POSTS */}
<FlatList
data={visiblePosts}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.post}>
<Text style={styles.postTitle}>{item.title}</Text>
<Text>{item.description}</Text>

<Text style={styles.location}>
{item.location?.street || ""} {item.location?.area || ""},{" "}
{item.location?.city || ""}, {item.location?.county || ""}
</Text>

{item.image && (
<Image source={{ uri: item.image }} style={styles.image} />
)}

<Pressable onPress={() => toggleLike(item.id, item.likes || [])}>
<Text style={styles.like}>
❤️ {Array.isArray(item.likes) ? item.likes.length : 0} Likes
</Text>
</Pressable>

<Text style={{ marginTop: 5, color: "gray", fontWeight: "bold" }}>
Status: {item.status || "open"}
</Text>

{/* DELETE */}
{item.userId === user?.uid && (
<Pressable
onPress={() => deletePost(item.id)}
style={{
backgroundColor: "red",
padding: 6,
borderRadius: 6,
marginTop: 8,
alignItems: "center",
}}
>
<Text style={{ color: "white", fontWeight: "bold" }}>
Delete Post
</Text>
</Pressable>
)}

{/* COMMENTS */}
{(item.comments || []).map((c: any, i: number) => (
<Text key={i} style={styles.comment}>
{c.user}: {c.text}
</Text>
))}

<TextInput
placeholder="Write a comment..."
value={commentText[item.id] || ""}
onChangeText={(text) =>
setCommentText((prev: any) => ({
...prev,
[item.id]: text,
}))
}
style={styles.input}
/>

<Pressable
style={styles.commentButton}
onPress={() => addComment(item.id)}
>
<Text style={styles.buttonText}>Post Comment</Text>
</Pressable>
</View>
)}
/>
</View>

{/* 🔴 LOGOUT (THINNER) */}
<Pressable
style={styles.logoutButton}
onPress={async () => {
await signOut(auth);
router.replace("/login");
}}
>
<Text style={styles.buttonText}>Logout</Text>
</Pressable>

</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
backgroundColor: "#f5f5f5",
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 15,
},

button: {
backgroundColor: "#2e86de",
padding: 12,
borderRadius: 10,
alignItems: "center",
marginBottom: 10,
},

logoutButton: {
backgroundColor: "red",
paddingVertical: 8,
paddingHorizontal: 12,
borderRadius: 10,
alignItems: "center",
marginBottom: 10,
},

buttonText: {
color: "white",
fontWeight: "bold",
},

post: {
backgroundColor: "white",
padding: 12,
borderRadius: 10,
marginTop: 10,
},

postTitle: {
fontWeight: "bold",
fontSize: 16,
},

location: {
marginTop: 5,
color: "gray",
},

image: {
width: "100%",
height: 180,
borderRadius: 10,
marginTop: 10,
},

like: {
marginTop: 10,
fontWeight: "bold",
},

comment: {
fontSize: 13,
marginTop: 3,
},

input: {
backgroundColor: "#eee",
padding: 8,
borderRadius: 8,
marginTop: 8,
},

commentButton: {
backgroundColor: "#00b894",
padding: 8,
borderRadius: 8,
marginTop: 5,
alignItems: "center",
},
});

