mport { useEffect, useState } from "react";
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

import { router, useLocalSearchParams } from "expo-router";
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
const [userCity, setUserCity] = useState("");

// FILTER PARAMS
const params = useLocalSearchParams();

const filterCity = (params.city as string) || "";
const filterArea = (params.area as string) || "";
const filterCounty = (params.county as string) || "";

// =====================
// LOAD USER
// =====================
useEffect(() => {
const fetchUserData = async () => {
if (!user) return;

const snap = await getDoc(doc(db, "users", user.uid));

if (snap.exists()) {
const data = snap.data();

setName(data.name || "");

setUserCity(
(data.location?.city || data.city || "")
.toLowerCase()
.trim()
);
}
};

fetchUserData();
}, []);

// =====================
// LOAD POSTS
// =====================
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

// =====================
// LIKE
// =====================
const toggleLike = async (postId: string, likes: string[] = []) => {
const postRef = doc(db, "posts", postId);

const safeLikes = Array.isArray(likes) ? likes : [];
const hasLiked = safeLikes.includes(user?.email || "");

await updateDoc(postRef, {
likes: hasLiked
? arrayRemove(user?.email)
: arrayUnion(user?.email),
});
};

// =====================
// COMMENT
// =====================
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

setCommentText((prev: any) => ({
...prev,
[postId]: "",
}));
};

// =====================
// DELETE
// =====================
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

// =====================
// 🔥 FIXED FILTER LOGIC (REAL WORKING VERSION)
// =====================
const visiblePosts = posts.filter((post) => {
if (post.status === "archived") return false;

const postCity = (post.location?.city || "").toLowerCase().trim();
const postArea = (post.location?.area || "").toLowerCase().trim();
const postCounty = (post.location?.county || "").toLowerCase().trim();

const userCityClean = (userCity || "").toLowerCase().trim();

const filterCityClean = (filterCity || "").toLowerCase().trim();
const filterAreaClean = (filterArea || "").toLowerCase().trim();
const filterCountyClean = (filterCounty || "").toLowerCase().trim();

const isOwner = post.userId === user?.uid;

/**
* STEP 1: if NO filter → normal city feed
*/
const hasFilter =
filterCityClean || filterAreaClean || filterCountyClean;

if (!hasFilter) {
return isOwner || postCity === userCityClean;
}

/**
* STEP 2: filter mode overrides city restriction
*/
const matchesFilter =
(!filterCityClean || postCity === filterCityClean) &&
(!filterAreaClean || postArea === filterAreaClean) &&
(!filterCountyClean || postCounty === filterCountyClean);

return isOwner || matchesFilter;
});

return (
<View style={styles.container}>

<Text style={styles.title}>
Welcome {name || user?.email || "User"}
</Text>

<Pressable
style={styles.createBtn}
onPress={() => router.push("/create-post")}
>
<Text style={styles.buttonText}>＋ Create Post</Text>
</Pressable>

<FlatList
data={visiblePosts}
keyExtractor={(item) => item.id}
contentContainerStyle={{ paddingBottom: 200 }}
renderItem={({ item }) => (
<View style={styles.post}>

<Text style={styles.postUser}>
Posted by {item.userName}
</Text>

<Text style={styles.postTitle}>{item.title}</Text>
<Text>{item.description}</Text>

<Text style={styles.location}>
{item.location?.street} {item.location?.area},{" "}
{item.location?.city}, {item.location?.county}
</Text>

{item.image && (
<Image source={{ uri: item.image }} style={styles.image} />
)}

<Pressable onPress={() => toggleLike(item.id, item.likes || [])}>
<Text style={styles.like}>
❤️ {item.likes?.length || 0} Likes
</Text>
</Pressable>

<Text style={{ marginTop: 5, color: "gray" }}>
Status: {item.status || "open"}
</Text>

{item.userId === user?.uid && (
<Pressable
onPress={() => deletePost(item.id)}
style={styles.deleteBtn}
>
<Text style={{ color: "white" }}>Delete Post</Text>
</Pressable>
)}

{(item.comments || []).map((c: any, i: number) => (
<Text key={i}>
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

<Pressable onPress={() => addComment(item.id)}>
<Text>Post Comment</Text>
</Pressable>

</View>
)}
/>

{/* NAV */}
<View style={styles.bottomNav}>

<Pressable onPress={() => router.push("/filter")}>
<Text style={styles.navText}>🔍 Filter</Text>
</Pressable>

<Pressable onPress={() => router.push("/notifications")}>
<Text style={styles.navText}>🔔 Alerts</Text>
</Pressable>

<Pressable onPress={() => router.push("/profile")}>
<Text style={styles.navText}>👤 Profile</Text>
</Pressable>

<Pressable
onPress={async () => {
await signOut(auth);
router.replace("/login");
}}
>
<Text style={styles.navText}>🚪 Logout</Text>
</Pressable>

</View>

</View>
);
}

// =====================
// STYLES
// =====================
const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
backgroundColor: "#d1d5db",
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 10,
},

createBtn: {
backgroundColor: "#2563eb",
padding: 12,
borderRadius: 12,
marginBottom: 12,
alignItems: "center",
},

buttonText: {
color: "white",
fontWeight: "bold",
fontSize: 16,
},

post: {
backgroundColor: "white",
padding: 12,
borderRadius: 10,
marginTop: 10,
},

postUser: {
fontSize: 13,
color: "gray",
marginBottom: 5,
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

input: {
backgroundColor: "#eee",
padding: 8,
borderRadius: 8,
marginTop: 5,
},

deleteBtn: {
backgroundColor: "red",
padding: 6,
borderRadius: 6,
marginTop: 8,
alignItems: "center",
},

bottomNav: {
position: "absolute",
bottom: 50,
left: 0,
right: 0,
flexDirection: "row",
justifyContent: "space-around",
backgroundColor: "#0b1220",
padding: 12,
borderRadius: 12,
},

navText: {
color: "#60a5fa",
fontWeight: "bold",
},
});



