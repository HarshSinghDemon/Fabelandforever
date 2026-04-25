'use client';
// Cleaned up error classes
export class FirestorePermissionError extends Error {
  constructor() {
    super("Insufficient permissions");
    this.name = 'FirebaseError';
  }
}