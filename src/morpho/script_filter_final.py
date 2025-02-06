import json

# Load market IDs from File 1 (Interface Vaults)
with open("./output/market_ids_interface.json", "r", encoding="utf-8") as f:
    market_ids = json.load(f)

# Extract the list of marketId values from File 1
valid_market_ids = set(entry["marketId"] for entry in market_ids)

# Load all markets from File 2 (Full Market Data)
with open("./output/allVaultsDoc.json", "r", encoding="utf-8") as f:
    all_markets = json.load(f)

# Filter File 2 to only include matching marketId entries
filtered_markets = [entry for entry in all_markets if entry["marketId"] in valid_market_ids]

# Save the filtered data to a new JSON file
with open("filtered_markets.json", "w", encoding="utf-8") as f:
    json.dump(filtered_markets, f, indent=4)

print(f"Filtered {len(filtered_markets)} markets based on interface vaults.")
