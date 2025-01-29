const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// API Endpoint for Dex Screener
const DEX_SCREENER_API = "https://api.dexscreener.com/latest/dex/tokens/solana";

// Rug Threshold and Tier 1 Volume Threshold
const RUG_THRESHOLD = 0.00001; // Lowered rug threshold
const TIER_1_VOLUME_THRESHOLD = 1000000;

// ✅ Default route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Crypto Bot Backend is Running!");
});

// ✅ Endpoint to fetch and filter tokens
app.get("/api/coins", async (req, res) => {
  try {
    // Fetch token data from Dex Screener API
    const response = await axios.get(DEX_SCREENER_API);

    console.log("Raw API Response:", response.data);

    // ✅ Ensure the API response contains `pairs` array
    const allTokens = response.data.pairs || [];

    console.log("Extracted Tokens:", allTokens.length);

    // ✅ Filter tokens based on criteria
    const filteredTokens = allTokens
      .filter(token => token.priceUsd && token.baseToken)
      .filter(token => parseFloat(token.priceUsd) >= RUG_THRESHOLD)
      .map(token => ({
        name: token.baseToken.name || "Unknown",
        symbol: token.baseToken.symbol || "Unknown",
        contractAddress: token.baseToken.address,
        price: parseFloat(token.priceUsd).toFixed(6), // Fix NaN issues
        volume: token.volume?.h24 ? token.volume.h24.toLocaleString() : "0",
        marketCap: token.fdv || "N/A",
        chainId: token.chainId,
        url: `https://dexscreener.com/${token.chainId}/${token.baseToken.address}`
      }));

    console.log("Filtered Tokens:", filteredTokens.length);

    res.status(200).json(filteredTokens);
  } catch (error) {
    console.error("Error fetching tokens:", error.message);
    res.status(500).json({ message: "Failed to fetch token data", error: error.message });
  }
});

// ✅ Endpoint for configuration values
app.get("/api/config", (req, res) => {
  res.json({
    rug_threshold: RUG_THRESHOLD,
    tier_1_volume_threshold: TIER_1_VOLUME_THRESHOLD,
  });
});

// ✅ Use PORT for Render deployment
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});