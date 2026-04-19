import { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
StyleSheet,
TextInput,
Pressable,
} from "react-native";

import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { router } from "expo-router";

export default function Filter() {
const [posts, setPosts] = useState<any[]>([]);

const [city, setCity] = useState("");
const [area, setArea] = useState("");
const [county, setCounty] = useState("");

// GET POSTS
useEffect(() => {
const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

const unsub = onSnapshot(q, (snapshot) => {
const data = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

setPosts(data);
});

return () => unsub();
}, []);

// CHECK IF USER IS FILTERING
const isFiltering =
city !== "" || area !== "" || county !== "";

// FILTER LOGIC
const filteredPosts = isFiltering
? posts.filter((post) => {
const cityMatch =
city === "" ||
post.location?.city?.toLowerCase().includes(city.toLowerCase());

const areaMatch =
area === "" ||
post.location?.area?.toLowerCase().includes(area.toLowerCase());

const countyMatch =
county === "" ||
post.location?.county
?.toLowerCase()
.includes(county.toLowerCase());

return cityMatch && areaMatch && countyMatch;
})
: [];

return (
<View style={styles.container}>
<Text style={styles.title}>Filter Posts</Text>

{/* BACK */}
<Pressable onPress={() => router.back()}>
<Text style={styles.back}>← Back</Text>
</Pressable>

{/* INPUTS */}
<TextInput
placeholder="City"
value={city}
onChangeText={setCity}
style={styles.input}
/>

<TextInput
placeholder="Area / Neighborhood"
value={area}
onChangeText={setArea}
style={styles.input}
/>

<TextInput
placeholder="County"
value={county}
onChangeText={setCounty}
style={styles.input}
/>

{/* CLEAR */}
<Pressable
style={styles.clearButton}
onPress={() => {
setCity("");
setArea("");
setCounty("");
}}
>
<Text style={styles.clearText}>Clear Filters</Text>
</Pressable>

{/* RESULTS OR EMPTY STATE */}
{!isFiltering ? (
<Text style={styles.emptyText}>
Enter a city, area, or county to view posts
</Text>
) : (
<FlatList
data={filteredPosts}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<View style={styles.card}>
<Text style={styles.postTitle}>{item.title}</Text>
<Text>{item.description}</Text>

<Text style={styles.location}>
{item.location?.street || ""}{" "}
{item.location?.area || ""},{" "}
{item.location?.city || ""},{" "}
{item.location?.county || ""}
</Text>
</View>
)}
/>
)}
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
marginBottom: 10,
},

back: {
color: "blue",
marginBottom: 10,
},

input: {
backgroundColor: "white",
padding: 10,
borderRadius: 8,
marginBottom: 10,
},

clearButton: {
backgroundColor: "#e74c3c",
padding: 10,
borderRadius: 8,
alignItems: "center",
marginBottom: 10,
},

clearText: {
color: "white",
fontWeight: "bold",
},

card: {
backgroundColor: "white",
padding: 12,
borderRadius: 10,
marginBottom: 10,
},

postTitle: {
fontWeight: "bold",
fontSize: 16,
},

location: {
marginTop: 5,
color: "gray",
},

emptyText: {
marginTop: 30,
textAlign: "center",
color: "gray",
fontSize: 16,
},
});

