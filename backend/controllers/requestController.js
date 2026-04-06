const { db, admin } = require('../config/firebaseHelper');
const { getServerClient } = require('./chatController');

exports.createRequest = async (req, res) => {
    try {
        const { rideId, requesterId, requesterName, driverId, driverName } = req.body;
        
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        // Check if ride has available seats
        const rideRef = db.collection('rides').doc(rideId);
        const rideDoc = await rideRef.get();
        if (!rideDoc.exists) {
            return res.status(404).json({ error: "Ride does not exist" });
        }
        if (rideDoc.data().seats <= 0) {
            return res.status(400).json({ error: "No seats available on this ride" });
        }
        if (rideDoc.data().driverId === requesterId) {
             return res.status(400).json({ error: "You cannot request to join your own ride" });
        }

        // Check if user already requested
        const existingReqs = await db.collection('ride_requests')
            .where('rideId', '==', rideId)
            .where('requesterId', '==', requesterId)
            .where('status', '==', 'pending')
            .get();
        
        if (!existingReqs.empty) {
            return res.status(400).json({ error: "You have already requested to join this ride" });
        }

        const newRequest = {
            rideId,
            requesterId,
            requesterName,
            driverId,
            driverName,
            status: 'pending', // pending, accepted, rejected
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('ride_requests').add(newRequest);

        // Simulate sending SMS
        console.log(`\n===========================================`);
        console.log(`[SMS NOTIFICATION SIMULATION]`);
        console.log(`To: Driver ${driverName} (ID: ${driverId})`);
        console.log(`Message: "Hello ${driverName}! ${requesterName} has requested to join your ride. Log in to your Rydeon dashboard to confirm."`);
        console.log(`===========================================\n`);

        res.status(201).json({ id: docRef.id, ...newRequest, message: "Request sent to the driver for confirmation." });
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ error: "Failed to create request" });
    }
};

exports.getPendingRequests = async (req, res) => {
    try {
        const { driverId } = req.params;
        if (!db) return res.status(500).json({ error: "Database not initialized" });
        
        const snapshot = await db.collection('ride_requests')
            .where('driverId', '==', driverId)
            .where('status', '==', 'pending')
            .orderBy('createdAt', 'desc')
            .get();
            
        const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Failed to fetch requests" });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, driverId } = req.body; // status should be 'accepted' or 'rejected'
        
        if (!db) return res.status(500).json({ error: "Database not initialized" });

        const reqRef = db.collection('ride_requests').doc(requestId);
        
        // Use a transaction since if we accept, we need to modify the ride
        await db.runTransaction(async (transaction) => {
            const reqDoc = await transaction.get(reqRef);
            if (!reqDoc.exists) {
                throw new Error("Request does not exist");
            }
            const reqData = reqDoc.data();
            
            if (reqData.driverId !== driverId) {
                throw new Error("Unauthorized to update this request");
            }
            if (reqData.status !== 'pending') {
                 throw new Error("Request is already processed");
            }
            if (status === 'accepted') {
                const rideRef = db.collection('rides').doc(reqData.rideId);
                const rideDoc = await transaction.get(rideRef);
                
                if (!rideDoc.exists) throw new Error("Ride no longer exists");
                const rideData = rideDoc.data();
                
                if (rideData.seats <= 0) throw new Error("No seats available to accept this request");
                if ((rideData.riders || []).some(r => r.userId === reqData.requesterId)) {
                     throw new Error("User is already in this ride");
                }

                // Create unique channelId for Stream Chat between Driver & Rider
                const channelId = [reqData.driverId, reqData.requesterId].sort().join('-');

                // Add rider and decrement seat
                const newRiders = [...(rideData.riders || []), { userId: reqData.requesterId, userName: reqData.requesterName, channelId }];
                transaction.update(rideRef, { 
                    seats: rideData.seats - 1,
                    riders: newRiders
                });
                
                // Simulate sending confirmation SMS to requester
                console.log(`\n===========================================`);
                console.log(`[SMS NOTIFICATION SIMULATION]`);
                console.log(`To: Rider ${reqData.requesterName} (ID: ${reqData.requesterId})`);
                console.log(`Message: "Great news! ${reqData.driverName} has confirmed your seat for the ride."`);
                console.log(`===========================================\n`);
            } else if (status === 'rejected') {
                // Simulate sending rejection SMS to requester
                console.log(`\n===========================================`);
                console.log(`[SMS NOTIFICATION SIMULATION]`);
                console.log(`To: Rider ${reqData.requesterName} (ID: ${reqData.requesterId})`);
                console.log(`Message: "We're sorry, ${reqData.driverName} is unable to accept your request for the ride."`);
                console.log(`===========================================\n`);
            } else {
                throw new Error("Invalid status type");
            }

            // Update request status
            transaction.update(reqRef, { status });
        });

        // Auto-create the Stream Channel after transaction succeeds so users get websocket events
        if (status === 'accepted') {
            try {
                const serverClient = getServerClient();
                if (serverClient) {
                     const doc = await reqRef.get();
                     if (doc.exists) {
                         const data = doc.data();
                         // We also need ride data
                         const rideDoc = await db.collection('rides').doc(data.rideId).get();
                         const pickup = rideDoc.exists ? rideDoc.data().pickup : '';
                         const dropoff = rideDoc.exists ? rideDoc.data().dropoff : '';

                         const channelId = [data.driverId, data.requesterId].sort().join('-');
                         const channel = serverClient.channel('messaging', channelId, {
                             members: [data.driverId, data.requesterId],
                             created_by_id: data.driverId,
                             name: "Ride Chat",
                             pickup,
                             dropoff,
                             read_events: true
                         });
                         await channel.create();
                     }
                }
            } catch (err) {
                console.error("Failed to auto-create stream channel", err);
            }
        }

        res.status(200).json({ message: `Request ${status} successfully` });
    } catch (error) {
        console.error("Error updating request:", error);
        res.status(400).json({ error: error.message });
    }
};
