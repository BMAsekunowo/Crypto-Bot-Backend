const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoint for Dex Screener
const DEX_SCREENER_API = "https://api.dexscreener.com/token-profiles/latest/v1";

// Rug Threshold and Tier 1 Volume Threshold (for potential usage)
const RUG_THRESHOLD = 0.5; // Adjust this based on requirements
const TIER_1_VOLUME_THRESHOLD = 1000000; // Adjust this based on requirements

// Endpoint to fetch and filter tokens
app.get("/api/coins", async (req, res) => {
  try {
    // Fetch token data from Dex Screener API
    const response = await axios.get(DEX_SCREENER_API);

    // Debug: Log raw response
    console.log("Raw API Response:", response.data);

    // Extract tokens
    const allTokens = response.data || [];
    console.log("Extracted Tokens:", allTokens);

    // Modify filtering logic based on actual structure
    const filteredTokens = allTokens.filter((token) => {
      // Example: Only include tokens with chainId "ethereum" or "solana"
      return token.chainId === "ethereum" || token.chainId === "solana";
    });

    console.log("Filtered Tokens:", filteredTokens);

    // Respond with filtered tokens
    res.status(200).json(filteredTokens);
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    res.status(500).json({ message: "Failed to fetch token data", error: error.message });
  }
});

// Endpoint to serve configuration (if needed)
app.get("/api/config", (req, res) => {
  res.json({
    rug_threshold: RUG_THRESHOLD,
    tier_1_volume_threshold: TIER_1_VOLUME_THRESHOLD,
  });
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});