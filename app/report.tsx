import { useState } from "react";
import {
View,
Text,
TextInput,
Pressable,
Alert,
StyleSheet,
} from "react-native";

import { issuesStore } from "../lib/store";
import { router } from "expo-router";

export default function ReportScreen() {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [location, setLocation] = useState("");

const handleSubmit = () => {
if (!title || !description || !location) {
Alert.alert("Error", "Please fill all fields");
return;
}

const newIssue = {
id: Date.now().toString(),
title,
description,
location,
status: "Pending",
likes: 0,
comments: [],
};

issuesStore.push(newIssue);

Alert.alert("Success", "Issue reported!");
router.replace("/home");
};

return (
<View style={styles.container}>
<Text style={styles.title}>Report an Issue</Text>

<TextInput
placeholder="Title"
value={title}
onChangeText={setTitle}
style={styles.input}
/>

<TextInput
placeholder="Description"
value={description}
onChangeText={setDescription}
style={styles.input}
/>

<TextInput
placeholder="Location"
value={location}
onChangeText={setLocation}
style={styles.input}
/>

<Pressable style={styles.button} onPress={handleSubmit}>
<Text style={styles.buttonText}>Submit Issue</Text>
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
fontSize: 24,
fontWeight: "bold",
marginBottom: 20,
},
input: {
backgroundColor: "white",
padding: 12,
marginBottom: 12,
borderRadius: 8,
},
button: {
backgroundColor: "#2e86de",
padding: 15,
borderRadius: 10,
alignItems: "center",
},
buttonText: {
color: "white",
fontWeight: "bold",
},
});
