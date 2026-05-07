import { useState, useEffect } from "react";
import {
View,
Text,
TextInput,
Pressable,
Alert,
StyleSheet,
Image,
ScrollView,
SafeAreaView,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { db, auth } from "../lib/firebase";
import {
collection,
addDoc,
doc,
getDoc,
getDocs,
} from "firebase/firestore";

import { router, useLocalSearchParams } from "expo-router";

export default function CreatePost() {

const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const [street, setStreet] = useState("");
const [area, setArea] = useState("");
const [city, setCity] = useState("");
const [county, setCounty] = useState("");

const [image, setImage] = useState<string | null>(null);

// 📍 LOCATION STATE
const [location, setLocation] = useState<any>(null);

// GET MAP PARAMS
const params = useLocalSearchParams();

// RECEIVE MAP DATA
useEffect(() => {
if (!params.latitude || !params.longitude) return;

setLocation({
latitude: Number(params.latitude),
longitude: Number(params.longitude),

street: (params.street as string) || "",
area: (params.area as string) || "",
city: (params.city as string) || "",
county: (params.county as string) || "",
});
}, [params.latitude, params.longitude]);

// 📸 IMAGE PICKER
const pickImage = async () => {
const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

if (!permission.granted) {
Alert.alert("Permission required");
return;
}

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.Images,
allowsEditing: false,
quality: 0.8,
selectionLimit: 1,
});

if (!result.canceled && result.assets.length > 0) {
setImage(result.assets[0].uri);
}
};

// 🚀 CREATE POST + NOTIFICATIONS FIX
const handlePost = async () => {
try {
const user = auth.currentUser;

if (!user) {
Alert.alert("Error", "Not logged in");
return;
}

const userSnap = await getDoc(doc(db, "users", user.uid));

let userName = user.email;

if (userSnap.exists()) {
const data = userSnap.data();
if (data?.name) userName = data.name;
}

// STEP 1: CREATE POST
const postRef = await addDoc(collection(db, "posts"), {
title: title.trim(),
description: description.trim(),

location: {
street: (location?.street || street).trim().toLowerCase(),
area: (location?.area || area).trim().toLowerCase(),
city: (location?.city || city).trim().toLowerCase(),
county: (location?.county || county).trim().toLowerCase(),

latitude: location?.latitude || null,
longitude: location?.longitude || null,
},

image: image || null,

createdAt: new Date(),

userId: user.uid,
userName,

likes: [],
comments: [],
status: "open",
});

// STEP 2: SEND NOTIFICATIONS (CITY MATCH ONLY)
const usersSnap = await getDocs(collection(db, "users"));

usersSnap.forEach(async (u) => {
const userData = u.data();

const userCity = (userData.city || "").toLowerCase();
const postCity = (city || "").toLowerCase();

if (userCity && postCity && userCity === postCity && u.id !== user.uid) {
await addDoc(collection(db, "users", u.id, "notifications"), {
title: "New post in your area",
body: title,
postId: postRef.id,
read: false,
createdAt: new Date(),
});
}
});

Alert.alert("Success", "Post created!");
router.replace("/home");

} catch (error: any) {
Alert.alert("Error", error.message);
}
};

return (
<SafeAreaView style={styles.container}>

<ScrollView contentContainerStyle={styles.form}>

<Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
<Text style={{ color: "#2e86de", fontWeight: "bold" }}>
← Go Back
</Text>
</Pressable>

<Text style={styles.title}>Create Post</Text>

<TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
<TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
<TextInput placeholder="Street" value={street} onChangeText={setStreet} style={styles.input} />
<TextInput placeholder="Area" value={area} onChangeText={setArea} style={styles.input} />
<TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
<TextInput placeholder="County" value={county} onChangeText={setCounty} style={styles.input} />

<Pressable
style={styles.mapButton}
onPress={() => router.push("/map-picker")}
>
<Text style={{ color: "white" }}>📍 Select Location on Map</Text>
</Pressable>

{location && (
<Text style={{ color: "green", marginBottom: 10 }}>
📍 {location.street || location.city || "Location selected"}
</Text>
)}

{image && (
<Image source={{ uri: image }} style={styles.image} />
)}

</ScrollView>

<View style={styles.buttonContainer}>

<Pressable style={styles.button} onPress={pickImage}>
<Text style={{ color: "white" }}>Add Photo</Text>
</Pressable>

<Pressable style={styles.button} onPress={handlePost}>
<Text style={{ color: "white" }}>Submit Post</Text>
</Pressable>

</View>

</SafeAreaView>
);
}

const styles = StyleSheet.create({

container: {
flex: 1,
backgroundColor: "white",
},

form: {
padding: 20,
paddingBottom: 140,
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 20,
},

input: {
borderWidth: 1,
padding: 10,
marginBottom: 10,
borderRadius: 8,
},

image: {
width: "70%",
height: 100,
marginTop: 10,
borderRadius: 10,
},

buttonContainer: {
position: "absolute",
bottom: 30,
left: 20,
right: 20,
},

button: {
backgroundColor: "#2e86de",
padding: 12,
marginTop: 10,
alignItems: "center",
borderRadius: 8,
},

mapButton: {
backgroundColor: "#16a34a",
padding: 12,
marginTop: 10,
alignItems: "center",
borderRadius: 8,
},
});



