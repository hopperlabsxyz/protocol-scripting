from bs4 import BeautifulSoup
import json

# Input and output files
html_file = "./morpho_interface.html"  # Update with your actual file path
output_file = "./output/market_ids_interface.json"

# Read and parse the HTML file
with open(html_file, "r", encoding="utf-8") as f:
    data = f.read()
    soup = BeautifulSoup(data, "lxml")

market_ids = []

# Find all <a> tags with the required href pattern
for a_tag in soup.select("a.css-woda04[href]"):
    href_value = a_tag["href"]

    # Ensure the URL contains "network=mainnet"
    if "network=mainnet" in href_value:
        # Extract the marketId from the href
        market_id = href_value.split("id=")[-1].split("&")[0]  # Extract value after "id=" and before "&"
        market_ids.append(market_id)

# Save to JSON file
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(market_ids, f, indent=4)

print(f"Extracted {len(market_ids)} market IDs on mainnet.")
