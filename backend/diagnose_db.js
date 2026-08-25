const { db } = require('./config/firebaseHelper');

async function diagnose() {
  if (!db) {
    console.error("Database not initialized");
    process.exit(1);
  }

  try {
    console.log("=== RIDES COLLECTION ===");
    const ridesSnap = await db.collection('rides').get();
    if (ridesSnap.empty) {
      console.log("No rides found");
    } else {
      ridesSnap.forEach(doc => {
        console.log(`Ride ID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    }

    console.log("\n=== RIDE_REQUESTS COLLECTION ===");
    const requestsSnap = await db.collection('ride_requests').get();
    if (requestsSnap.empty) {
      console.log("No requests found");
    } else {
      requestsSnap.forEach(doc => {
        console.log(`Request ID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    }

    console.log("\n=== USERS COLLECTION ===");
    const usersSnap = await db.collection('users').get();
    if (usersSnap.empty) {
      console.log("No users found");
    } else {
      usersSnap.forEach(doc => {
        console.log(`User ID: ${doc.id}`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    }

    process.exit(0);
  } catch (err) {
    console.error("Diagnosis failed:", err);
    process.exit(1);
  }
}

diagnose();
