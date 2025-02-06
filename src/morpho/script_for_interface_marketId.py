from bs4 import BeautifulSoup
import json
import glob

# Directory where your HTML files are stored
html_files = glob.glob("./html_interface/*.html")
output_file = "./output/market_ids_interface.json"

market_data = {}  # Use a dictionary to store unique market IDs and their data

for html_file in html_files:
    with open(html_file, "r", encoding="utf-8") as f:
        data = f.read()
        soup = BeautifulSoup(data, "lxml")

    # Find all <a> tags with the required href pattern
    for a_tag in soup.select("a.css-woda04[href]"):
        href_value = a_tag["href"]

        # Ensure the URL contains "network=mainnet"
        if "network=mainnet" in href_value:
            # Extract the marketId
            market_id = href_value.split("id=")[-1].split("&")[0]  

            # Skip duplicates (market_data dictionary ensures uniqueness)
            if market_id in market_data:
                continue

            # Extract additional data (modify selectors based on your HTML structure)
            parent_td = a_tag.find_parent("td")  # Find parent <td> of the link
            market_name = parent_td.text.strip() if parent_td else "Unknown"

            # Store data in dictionary
            market_data[market_id] = {
                "marketId": market_id,
                "marketName": market_name
            }

# Convert dictionary to list and save as JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(list(market_data.values()), f, indent=4)

print(f"Extracted {len(market_data)} unique market IDs from {len(html_files)} HTML files.")
