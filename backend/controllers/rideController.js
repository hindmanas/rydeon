const { db, admin } = require('../config/firebaseHelper');

exports.createRide = async (req, res) => {
    try {
        const { driverId, driverName, pickup, dropoff, time, seats, price, allowedGender } = req.body;
        
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        const newRide = {
            driverId,
            driverName,
            pickup,
            dropoff,
            time,
            seats: parseInt(seats),
            price: parseFloat(price),
            allowedGender: allowedGender || 'all',
            riders: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('rides').add(newRide);
        res.status(201).json({ id: docRef.id, ...newRide });
    } catch (error) {
        console.error("Error creating ride:", error);
        res.status(500).json({ error: "Failed to create ride" });
    }
};

exports.getAllRides = async (req, res) => {
    try {
        if (!db) return res.status(500).json({ error: "Database not initialized" });
        const { uid } = req.query;
        
        let userGender = null;
        if (uid) {
            const userDoc = await db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                userGender = userDoc.data().gender;
            }
        }

        const snapshot = await db.collection('rides').orderBy('createdAt', 'desc').get();
        let rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter rides
        if (userGender) {
            rides = rides.filter(ride => {
                if (!ride.allowedGender || ride.allowedGender === 'all') return true;
                return ride.allowedGender.toLowerCase() === userGender.toLowerCase();
            });
        } else {
             // If no user/gender known, hide gender-restricted rides
             rides = rides.filter(ride => !ride.allowedGender || ride.allowedGender === 'all');
        }

        res.status(200).json(rides);
    } catch (error) {
        console.error("Error fetching rides:", error);
        res.status(500).json({ error: "Failed to fetch rides" });
    }
};

exports.joinRide = async (req, res) => {
    try {
        const { rideId, userId, userName } = req.body;
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        const rideRef = db.collection('rides').doc(rideId);

        // Run transaction to ensure seat safety
        await db.runTransaction(async (transaction) => {
            const rideDoc = await transaction.get(rideRef);
            if (!rideDoc.exists) {
                throw new Error("Ride does not exist");
            }
            
            const data = rideDoc.data();
            if (data.seats <= 0) {
                throw new Error("No seats available");
            }
            if ((data.riders || []).some(r => r.userId === userId)) {
                throw new Error("You already joined this ride");
            }
            if (data.driverId === userId) {
                 throw new Error("You cannot join your own ride");
            }

            const newRiders = [...(data.riders || []), { userId, userName }];
            transaction.update(rideRef, { 
                seats: data.seats - 1,
                riders: newRiders
            });
        });

        res.status(200).json({ message: "Successfully joined ride" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteRide = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // In real app, extracting from decoded token
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        const rideRef = db.collection('rides').doc(id);
        const doc = await rideRef.get();
        
        if (!doc.exists) return res.status(404).json({ error: "Ride not found" });
        if (doc.data().driverId !== userId) return res.status(403).json({ error: "Unauthorized" });

        // Delete associated pending requests
        const requestsSnapshot = await db.collection('ride_requests')
             .where('rideId', '==', id)
             .get();
             
        const batch = db.batch();
        requestsSnapshot.forEach(reqDoc => {
             batch.delete(reqDoc.ref);
        });
        await batch.commit();

        await rideRef.delete();
        res.status(200).json({ message: "Ride deleted successfully" });
    } catch (error) {
        console.error("Error deleting ride:", error);
        res.status(500).json({ error: "Failed to delete ride" });
    }
};

exports.getUserRides = async (req, res) => {
    try {
        const { uid } = req.params;
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        // Rides created by user
        const createdSnapshot = await db.collection('rides').where('driverId', '==', uid).get();
        const createdRides = createdSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // For rides joined by user, we might need a different structure or query if array contains objects
        // In Firestore, querying array of objects is tricky. Usually we store just userIds in an array field "riderIds" 
        // Let's get all rides and filter for now (not optimal for large scale, but works for MVP)
        const allRidesSnapshot = await db.collection('rides').get();
        const joinedRides = allRidesSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(ride => ride.riders && ride.riders.some(r => r.userId === uid));

        res.status(200).json({ createdRides, joinedRides });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user rides" });
    }
};

exports.finishRide = async (req, res) => {
    try {
        const { rideId, userId, satisfied } = req.body;
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        const rideRef = db.collection('rides').doc(rideId);
        
        await rideRef.update({
            completedBy: admin.firestore.FieldValue.arrayUnion(userId),
            feedback: admin.firestore.FieldValue.arrayUnion({ userId, satisfied })
        });

        res.status(200).json({ message: "Ride finished successfully" });
    } catch (error) {
        console.error("Error finishing ride:", error);
        res.status(500).json({ error: "Failed to finish ride" });
    }
};
