import { useState } from "react";
import {
View,
Text,
TextInput,
Pressable,
Alert,
StyleSheet,
Image,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { db, auth } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { router } from "expo-router";

export default function CreatePost() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const [street, setStreet] = useState("");
const [area, setArea] = useState("");
const [city, setCity] = useState("");
const [county, setCounty] = useState("");

const [image, setImage] = useState<string | null>(null);

// 📸 PICK IMAGE
const pickImage = async () => {
const permission =
await ImagePicker.requestMediaLibraryPermissionsAsync();

if (!permission.granted) {
Alert.alert("Permission required", "Allow access to photos");
return;
}

const result = await ImagePicker.launchImageLibraryAsync({
mediaTypes: ImagePicker.MediaTypeOptions.Images,
allowsEditing: true,
quality: 1,
});

if (!result.canceled) {
setImage(result.assets[0].uri);
}
};

// 🚀 SUBMIT POST
const handlePost = async () => {
try {
const user = auth.currentUser;

if (!user) {
Alert.alert("Error", "You must be logged in");
return;
}

if (
!title.trim() ||
!description.trim() ||
!area.trim() ||
!city.trim() ||
!county.trim()
) {
Alert.alert("Error", "Please fill all required fields");
return;
}

const postData = {
title: title.trim(),
description: description.trim(),

location: {
street: street.trim(),
area: area.trim(),
city: city.trim(),
county: county.trim(),
},

image: image || null, // ✅ IMAGE ADDED HERE

createdAt: new Date(),

userId: user.uid,
userName: user.displayName || user.email,

likes: {},
comments: [],

status: "open", // 🔥 IMPORTANT ADDITION
};

await addDoc(collection(db, "posts"), postData);

Alert.alert("Success", "Post created!", [
{
text: "OK",
onPress: () => router.replace("/home"),
},
]);
} catch (error: any) {
console.log("POST ERROR:", error);
Alert.alert("Error", error.message);
}
};

return (
<View style={styles.container}>
<Text style={styles.title}>Create Post</Text>

<TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
<TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />

<TextInput placeholder="Street (optional)" value={street} onChangeText={setStreet} style={styles.input} />
<TextInput placeholder="Area" value={area} onChangeText={setArea} style={styles.input} />
<TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
<TextInput placeholder="County" value={county} onChangeText={setCounty} style={styles.input} />

{/* 📸 IMAGE PREVIEW */}
{image && (
<Image source={{ uri: image }} style={styles.imagePreview} />
)}

{/* 📸 BUTTON TO PICK IMAGE */}
<Pressable style={styles.imageButton} onPress={pickImage}>
<Text style={styles.buttonText}>Add Photo</Text>
</Pressable>

{/* 🚀 SUBMIT */}
<Pressable style={styles.button} onPress={handlePost}>
<Text style={styles.buttonText}>Submit Post</Text>
</Pressable>
</View>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
justifyContent: "center",
backgroundColor: "#f5f5f5",
},

title: {
fontSize: 22,
fontWeight: "bold",
marginBottom: 20,
textAlign: "center",
},

input: {
borderWidth: 1,
borderColor: "#ccc",
padding: 10,
borderRadius: 8,
marginBottom: 10,
backgroundColor: "white",
},

imageButton: {
backgroundColor: "#6c5ce7",
padding: 10,
borderRadius: 10,
alignItems: "center",
marginBottom: 10,
},

button: {
backgroundColor: "#2e86de",
padding: 12,
borderRadius: 10,
alignItems: "center",
},

buttonText: {
color: "white",
fontWeight: "bold",
},

imagePreview: {
width: "100%",
height: 200,
borderRadius: 10,
marginBottom: 10,
},
});
