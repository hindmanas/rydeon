const { admin, db } = require('./config/firebaseHelper');

const email = 'teamrydeon@gmail.com';
const password = '12345678';
const uid = 'demo-user-teamrydeon';

async function createDemoUser() {
  if (!db) {
    console.error("Database (Firestore) / Firebase Admin is not initialized. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY is correct in backend/.env.");
    process.exit(1);
  }

  try {
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log(`User already exists with UID: ${userRecord.uid}. Updating password...`);
      userRecord = await admin.auth().updateUser(userRecord.uid, {
        password: password,
        displayName: 'Team Rydeon',
      });
      console.log('Password updated successfully.');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log(`User does not exist. Creating user...`);
        userRecord = await admin.auth().createUser({
          uid: uid,
          email: email,
          password: password,
          displayName: 'Team Rydeon',
          emailVerified: true
        });
        console.log(`User created successfully with UID: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // Now, create or update the user document in Firestore users collection
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      fullName: 'Team Rydeon',
      email: email,
      mobile: '+91 9999999999',
      gender: 'male',
      onboarded: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Firestore document created/updated for user UID: ${userRecord.uid}`);
    console.log('Demo user setup completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo user:', error);
    process.exit(1);
  }
}

createDemoUser();
