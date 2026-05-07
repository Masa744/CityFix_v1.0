# CityFix_v1.0

## 📌 App Overview
CityFix is a community-driven issue reporting platform designed to improve communication between residents and local city departments. The application allows users to report and document public infrastructure problems such as potholes, broken streetlights, graffiti, and safety hazards by submitting detailed posts with images, descriptions, and location information.

The main goal of CityFix is to create a faster and more efficient system for identifying and resolving community issues. Instead of relying on slow or informal reporting methods, users can instantly submit issues that are visible to both the community and authorized city personnel.

City administrators (admins) can review submitted reports, track their progress, and update their status (open, in progress, resolved). This creates a structured workflow between citizens and city management, improving accountability and response time.

Overall, CityFix enhances civic engagement by giving users an easy way to report problems and helping city officials manage and prioritize infrastructure issues more effectively.

---

## 🚀 Key Features
- User authentication allows residents and admins to sign up and log in securely.
- Residents can create and submit issue reports with images and location details.
- Residents can enter a location manually or select it on a map.
- Both residents and admins can view a community feed of reported issues.
- Residents can like and comment on posts.
- Admins can manage and review all submitted reports using a dashboard.
- Status tracking shows whether an issue is open, in progress, or resolved.
- Role-based access controls what residents and admins can do in the system.
- Residents receive notifications for new issues in their area and updates on their reports.
- Admins receive notifications when new reports are submitted in their assigned area.

---

## ⚙️ User Guide

### Installation
bash

git clone https://github.com/TechWithMasa/CityFix_v1.0.git
cd CityFix_v1.0
npm install
npx expo start

## How to Use the App

## Users (Residents)

1.Open the app using the provided installation method or simulator.
2. Create a new account or log in with existing credentials.
3. After login, you will be directed to the main feed.
4. Browse existing community reports submitted by other users.
5. Tap “Create Post” to report a new issue.
6. Enter the issue title, description, location, and upload an image.
7. Submit the report to publish it to the community feed.
8. View your submitted post in the feed after posting.
9. Like and comment on other users’ posts.
10. View updates on your submitted reports.
11. Track report status as Open, In Progress, or Resolved.
You can:
-Like other users’ posts
-Comment on issues
-View status updates on your own posts
-Track your report status:
-Open → newly submitted
-In Progress → being reviewed/handled
-Resolved → issue has been fixed

🏛️ Admins (City Personnel)
1. Log in using an admin account
2. Open the Admin Dashboard
3. View a list of all submitted community reports
4. Tap on any report to view full details
5. Review:
- Description of the issue
- Image evidence
- Location information
- User who submitted it
6. Take action by updating the status:
- Open → new/unreviewed issue
- In Progress → issue is being worked on
- Resolved → issue has been completed
7. Save changes to update the database
8. Updates are automatically reflected in the user feed in real time

Testing Strategy
The application was tested using manual testing during development to ensure all features work correctly and data is properly handled between the frontend and Firebase backend.

Testing focused on verifying core functionality, user interactions, data storage, and role-based access for both users and admin accounts.

🔍 Functional Testing
The following features were tested to confirm they work as expected:

• User registration and login with valid credentials
• Error handling for invalid login attempts
• User logout functionality
• Creating new posts with title, description, location, and image
• Uploading images successfully to Firebase Storage
• Displaying posts correctly in the main feed
• Viewing detailed post information
• Liking and commenting on posts
• Admin access restrictions (only admin users can access dashboard)
• Admin ability to update post status (open → in progress → resolved)
• Real-time updates reflecting changes in Firestore

🧾 Input Validation Testing
• Verified that required fields (title, description) cannot be left empty
• Checked that posts are not submitted without proper user authentication
• Ensured image upload handles both valid and missing image cases

  Data Persistence Testing
• Confirmed that posts remain saved after closing and reopening the app
• Verified that Firestore correctly stores and retrieves user and post data
• Ensured admin updates to post status persist correctly in the database

UI & Navigation Testing
• Checked navigation flow between all screens using Expo Router
• Ensured buttons, forms, and inputs function correctly
• Verified app layout consistency across different screens
• Tested usability on different screen sizes to ensure responsiveness

## 🧰 Technology Stack

- React Native (Expo) – mobile app framework
- Expo Router – navigation between screens
- Firebase Authentication – user login and registration
- Firebase Firestore – database for storing users and posts
- Firebase Storage – storing uploaded images
- TypeScript / JavaScript – programming language

## APIs and Third-Party Packages Used
Backend / Database
Firebase
Firestore Database (data storage for posts, users, notifications)
Firebase Authentication (user login & auth management)
• Frontend Framework
- React Native
- Expo Router (file-based navigation system)
  Third-Party Packages
• expo-image-picker
- Used for selecting images from the device gallery when creating posts.
• Firebase
- Core SDK for authentication, Firestore database, and real-time updates.
• expo-router
- Handles navigation between screens (Home, Profile, Create Post, Notifications, etc.).
• Core Features Powered By APIs
- Real-time posts and updates using Firestore listeners
- Location-based notifications using Firestore queries
- User profile storage and syncing via Firebase Firestore
- Image upload/selection via Expo Image Picker

 ## List of Contributors and Each Member's Role
• Masa: Group Leader and Backend 
- Led overall project planning, coordination, and task distribution across the team
- Designed and implemented core backend architecture using Firebase
- Managed Firestore database structure (users, posts, notifications, and roles)

• Adrian: Lead frontend (React Native) and Figma Design
- Led frontend development using React Native (Expo)
- Designed app wireframes and UI prototypes using Figma
- Built major screens including Home, Profile, Notifications, and Create Post
- Implemented navigation flow using Expo Router

• Abel: Frontend (React Native) and Figma Design
- Contributed to frontend development in React Native
- Assisted in building and styling key screens and reusable components
- Worked on UI consistency and layout improvements across the app

• Ayan: Backend and Database Management
- Assisted in backend development using Firebase Firestore
- Structured and optimized database collections for scalability
- Managed user data, posts, and notification logic

• Josiah: Frontend
- Contributed to frontend development using React Native
- Built and styled UI components for various app screens
- Assisted in implementing navigation and screen transitions
