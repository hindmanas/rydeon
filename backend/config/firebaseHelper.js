const admin = require('firebase-admin');
require('dotenv').config();

// Attempt to parse service account JSON from environment variable
// In a real application, you'd use a file or Google Secret Manager
// For setup without explicit credentials, we initialize an empty app or require user to provide credentials
let db = null;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) { 
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
      console.log('Firebase Admin initialized successfully');
  } else {
      console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env. Real-time API backend will fail until added.');
  }
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

module.exports = { admin, db };
