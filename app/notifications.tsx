import { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
StyleSheet,
Pressable,
Alert,
} from "react-native";

import { auth, db } from "../lib/firebase";
import {
collection,
query,
orderBy,
onSnapshot,
updateDoc,
doc,
deleteDoc,
} from "firebase/firestore";

import { router } from "expo-router";

export default function Notifications() {
const user = auth.currentUser;
const [notifications, setNotifications] = useState<any[]>([]);

// =====================
// LOAD NOTIFICATIONS
// =====================
useEffect(() => {
if (!user) return;

const q = query(
collection(db, "users", user.uid, "notifications"),
orderBy("createdAt", "desc")
);

const unsub = onSnapshot(q, (snapshot) => {
const data = snapshot.docs.map((d) => ({
id: d.id,
...d.data(),
}));

setNotifications(data);
});

return () => unsub();
}, []);

// =====================
// OPEN NOTIFICATION
// =====================
const openNotification = async (item: any) => {
try {
if (!user) return;

// mark as read
await updateDoc(
doc(db, "users", user.uid, "notifications", item.id),
{
read: true,
}
);

// go to post/issue page
if (item.postId) {
router.push(`/issue/${String(item.postId)}`);
}
} catch (error) {
console.log("OPEN NOTIF ERROR:", error);
}
};

// =====================
// DELETE NOTIFICATION
// =====================
const deleteNotification = async (id: string) => {
try {
if (!user) return;

await deleteDoc(
doc(db, "users", user.uid, "notifications", id)
);
} catch (error) {
console.log("DELETE NOTIF ERROR:", error);
}
};

return (
<View style={styles.container}>

<Pressable onPress={() => router.back()} style={{ marginBottom: 10 }}>
<Text style={{ color: "#2e86de", fontWeight: "bold" }}>
← Go Back
</Text>
</Pressable>

<Text style={styles.title}>Notifications</Text>

{notifications.length === 0 ? (
<Text style={styles.empty}>No notifications yet</Text>
) : (
<FlatList
data={notifications}
keyExtractor={(item) => item.id}
renderItem={({ item }) => (
<Pressable
style={[
styles.card,
item.read && { opacity: 0.5 },
]}
onPress={() => openNotification(item)}
>

<Text style={styles.text}>
{item.title}
</Text>

{item.body && (
<Text style={styles.body}>
{item.body}
</Text>
)}

<Text style={styles.status}>
{item.read ? "Read" : "New"}
</Text>

<Pressable
onPress={() =>
Alert.alert(
"Delete notification?",
"This cannot be undone.",
[
{ text: "Cancel", style: "cancel" },
{
text: "Delete",
style: "destructive",
onPress: () => deleteNotification(item.id),
},
]
)
}
style={styles.deleteBtn}
>
<Text style={{ color: "white", fontSize: 12 }}>
Delete
</Text>
</Pressable>

</Pressable>
)}
/>
)}
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
marginBottom: 15,
},

empty: {
textAlign: "center",
marginTop: 30,
color: "gray",
},

card: {
backgroundColor: "white",
padding: 12,
borderRadius: 10,
marginBottom: 10,
},

text: {
fontWeight: "bold",
},

body: {
marginTop: 5,
color: "gray",
},

status: {
marginTop: 5,
fontSize: 12,
color: "gray",
},

deleteBtn: {
marginTop: 10,
backgroundColor: "red",
padding: 6,
borderRadius: 6,
alignItems: "center",
width: 70,
},
});
