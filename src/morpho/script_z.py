from bs4 import BeautifulSoup
import json

if __name__ == "__main__":
    html_file = "./markets_doc.html"
    output_file = "./output/output0.json"

    with open(html_file, "r", encoding="utf-8") as f:
        data = f.read()
        soup = BeautifulSoup(data, "lxml")

    results = []
    rows = soup.select("tr")

    # Ensure there are rows and extract headers from the first row
    if rows:
        first_row = rows.pop(0)
        columns = [th.text.strip() for th in first_row.select("th")]
        print(f"Columns: {columns}")  # Debug: Print columns

    for row in rows:
        tds = row.select("td")

        # Skip rows without any <td> elements
        if not tds:
            # print("Skipping row: No <td> elements found")  # Debug: Print skipped rows
            continue
        
        # Skip rows where the first <td> contains "zero address"
        if tds[0].text.strip().lower() == "zero address":
            # print(f"Skipping row: Zero address found in {tds[0].text.strip()}")  # Debug: Print skipped rows
            continue

        # Process each row into a dictionary
        row_data = {}
        for i in range(min(len(columns), len(tds))):  # Prevent index errors
            cell = tds[i].select_one("a")

            if cell and "href" in cell.attrs:
                href_value = cell["href"]
                # print(f"Found href: {href_value}")  # Debug: Print all hrefs
                # Check if the href contains the Etherscan address URL
                if "etherscan.io/address/" in href_value.lower():  # Case-insensitive check
                    # Extract the address from the href
                    address = href_value.rsplit("/", 1)[-1]
                    print(f"Etherscan address found: {address}")  # Debug: Print Etherscan addresses
                    row_data[columns[i]] = address
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

        # Only append the row if it contains Etherscan addresses
        # if any("etherscan.io/address/" in str(cell).lower() for cell in row_data.values()):
            results.append(row_data)

    # Save to JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4)

    print(f"Processed {len(results)} rows with Etherscan addresses.")