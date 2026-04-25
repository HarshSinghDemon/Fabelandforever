# Fable & Forever | Artisanal Crochet Studio

This is a premium artisanal e-commerce platform built with Next.js, Genkit, and Firebase.

## 🧵 Admin Access (Master Weaver)

To access the Studio Control at `/admin`, you must manually authorize your account:

1. **Sign Up/Login**: Ensure you have an account created in Firebase Authentication.
2. **Copy UID**: Go to the Firebase Console -> Authentication -> Users. Copy your **User UID**.
3. **Firestore Setup**:
   - Go to Firestore Database.
   - Create a collection named `admin_users`.
   - Add a new document.
   - **Document ID**: Paste your UID here.
   - **Fields**: You can add `role: "admin"` (optional, the system checks for document existence).
4. **Login**: Go to `/admin/login` on the website and log in with your credentials.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **Database**: Firestore
- **Auth**: Firebase Auth
- **Storage**: Supabase (Cloud Storage)
- **AI**: Genkit (Custom Design Grimoire)

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/components`: Reusable UI components.
- `src/ai`: Genkit flows and AI logic.
- `src/firebase`: Firebase configuration and custom hooks.
- `docs/backend.json`: Blueprint for data structures.
