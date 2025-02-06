# This script is to scrape the data (all vaults) from morpho doc
#  This script is to be used to extract the data from the HTML file and convert it into a JSON file.
from bs4 import BeautifulSoup
import json
from web3 import Web3

# Function to compute the fullMarketId
def compute_market_params_id(params):
    # Convert each address to 32 bytes and numbers to a 32-byte hex string
    loan_token = Web3.to_hex(Web3.to_bytes(hexstr=params['loanToken']).rjust(32, b'\0'))
    collateral_token = Web3.to_hex(Web3.to_bytes(hexstr=params['collateralToken']).rjust(32, b'\0'))
    oracle = Web3.to_hex(Web3.to_bytes(hexstr=params['oracle']).rjust(32, b'\0'))
    irm = Web3.to_hex(Web3.to_bytes(hexstr=params['irm']).rjust(32, b'\0'))
    lltv = Web3.to_hex(int(params['lltv']).to_bytes(32, 'big'))

    # Concatenate all the parameters
    concatenated_params = (
        loan_token[2:] +  # Remove '0x' prefix
        collateral_token[2:] +
        oracle[2:] +
        irm[2:] +
        lltv[2:]
    )

    # Compute the Keccak256 hash
    return Web3.keccak(hexstr=concatenated_params).hex()

if __name__ == "__main__":
    html_file = "./markets_doc.html"
    output_file = "./output/allVaultsDoc.json"

    with open(html_file, "r", encoding="utf-8") as f:
        data = f.read()
        soup = BeautifulSoup(data, "lxml")

    results = []
    rows = soup.select("tr")

    # Ensure there are rows and extract headers from the first row
    if rows:
        first_row = rows.pop(0)
        columns = [th.text.strip() for th in first_row.select("th")]

    for row in rows:
        tds = row.select("td")

        # Skip rows without any <td> elements
        if not tds:
            continue
        
        # Skip rows where the first <td> contains "zero address"
        if tds[0].text.strip().lower() == "zero address":
            continue

        # Process each row into a dictionary
        row_data = {}
        has_etherscan_address = False  # Flag to track if the row has at least one Etherscan address

        for i in range(min(len(columns), len(tds))):  # Prevent index errors
            cell = tds[i].select_one("a")

            if cell and "href" in cell.attrs:
                href_value = cell["href"]
                # Check if the href contains the Etherscan address URL
                if "etherscan.io/address/" in href_value.lower():  # Case-insensitive check
                    # Extract the address from the href
                    address = href_value.rsplit("/", 1)[-1]
                    row_data[columns[i]] = address
                    has_etherscan_address = True  # Mark that this row has an Etherscan address
                else:
                    # If it's not an Etherscan address, skip this cell
                    continue
            else:
                row_data[columns[i]] = tds[i].text.strip()

        # Convert "LLTV" if it exists in the row data
        if "LLTV" in row_data and row_data["LLTV"].endswith("%"):
            try:
                row_data["LLTV"] = f'{float(row_data["LLTV"].strip("%")) * 10**16:.0f}'
            except ValueError:
                pass  # Ignore conversion if LLTV isn't a valid percentage

        # Only append the row if it contains at least one Etherscan address
        if has_etherscan_address:
            required_fields = ['loanToken', 'collateralToken', 'oracle', 'irm', 'lltv']
            
            # Skip rows that are missing any required field
            if not all(field in row_data for field in required_fields):
                continue
            
            # Compute the fullMarketId
            market_params = {
                'loanToken': row_data['loanToken'],
                'collateralToken': row_data['collateralToken'],
                'oracle': row_data['oracle'],
                'irm': row_data['irm'],
                'lltv': row_data['lltv']
            }
            
            row_data['marketId'] = compute_market_params_id(market_params)
            results.append(row_data)

    # Save to JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)

    print(f"Processed {len(results)} rows with Etherscan addresses.")