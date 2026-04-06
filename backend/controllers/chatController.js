const { StreamChat } = require('stream-chat');

// Initialize the stream server client globally when required
let _serverClient = null;
const getServerClient = () => {
    if (!_serverClient) {
        const apiKey = process.env.STREAM_API_KEY;
        const apiSecret = process.env.STREAM_API_SECRET;
        if (apiKey && apiSecret) {
            _serverClient = StreamChat.getInstance(apiKey, apiSecret);
        }
    }
    return _serverClient;
};

exports.getServerClient = getServerClient;

exports.getToken = (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
             return res.status(400).json({ error: "User ID is required" });
        }
        
        const serverClient = getServerClient();
        if (!serverClient) {
             console.error("Stream API keys are missing in .env");
             return res.status(500).json({ error: "Chat service configuration error" });
        }
        
        // Create auth token for the user
        const token = serverClient.createToken(userId);
        
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error generating stream token:", error);
        res.status(500).json({ error: "Failed to generate chat token" });
    }
};
