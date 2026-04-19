import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { issuesStore } from "../../lib/store";

export default function IssueDetails() {
const { id } = useLocalSearchParams();

const issue = issuesStore.find((i) => i.id === id);

if (!issue) {
return (
<View style={styles.container}>
<Text style={styles.notFound}>Issue not found</Text>
</View>
);
}

return (
<View style={styles.container}>
<Text style={styles.title}>{issue.title}</Text>

<Text style={styles.label}>Description</Text>
<Text style={styles.text}>{issue.description}</Text>

<Text style={styles.label}>Location</Text>
<Text style={styles.text}>{issue.location}</Text>

<Text style={styles.label}>Status</Text>
<Text style={styles.status}>{issue.status}</Text>
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
label: {
marginTop: 15,
fontWeight: "bold",
},
text: {
marginTop: 5,
fontSize: 14,
},
status: {
marginTop: 5,
fontSize: 14,
fontWeight: "bold",
color: "#2e86de",
},
notFound: {
fontSize: 16,
color: "red",
},
});
