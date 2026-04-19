# CityFix Database Structure (Firestore)

CityFix uses Firebase Firestore (NoSQL database). Data is stored in collections and documents instead of SQL tables.

---

## 📁 users collection

Stores all registered users.

### Fields:
- uid (string) – unique user ID from Firebase Auth
- name (string) – user’s display name
- email (string) – user email
- role (string) – "user" or "admin"
- createdAt (timestamp)

---

## 📁 posts collection

Stores all community issue reports.

### Fields:
- id (string)
- title (string)
- description (string)
- image (string URL)
- location (object)
- city (string)
- area (string)
- county (string)
- userId (string) – ID of user who created post
- likes (array of strings) – user emails or IDs
- comments (array of objects)
- user (string)
- text (string)
- status (string) – open / in progress / resolved
- createdAt (timestamp)

---

## 📌 Sample User Document

{
"uid": "user123", "name": "John Doe","email": "john@example.com",
"role": "user",
"createdAt": "2026-01-01"
}

---

## 📌 Sample Post Document

{
"title": "Broken streetlight",
"description": "Streetlight not working on Main Street",
"location": {
"city": "New York",
"area": "Manhattan",
"county": "NY"
},
"userId": "user123",
"likes": [],
"comments": [
{
"user": "jane@example.com",
"text": "I saw this too"
}
],


"status": "open",
"createdAt": "2026-01-01"

{
"uid": "user123",
"name": "John Doe",
}
