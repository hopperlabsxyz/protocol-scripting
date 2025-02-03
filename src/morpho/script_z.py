from bs4 import BeautifulSoup
from collections import OrderedDict
import json


if __name__ == "__main__":
    html_file = "./markets_doc.html"
    output_file = "zzz_.json"
    with open(html_file, "r") as f:
        data = f.read()
        soup = BeautifulSoup(data, "lxml")

    results = []
    rows = soup.select("tr")
    columns = [item.text for item in rows.pop(0).select("th")]
    for row in rows:
        if row.select("td")[0].text.strip() == "zero address":
            continue
        results.append(
            dict(
                zip(
                    columns,
                    [
                        (
                            cell.select("a")[0].attrs["href"].rsplit("/", 1)[1]
                            if cell.select("a")
                            else cell.text.strip()
                        )
                        for cell in row.select("td")
                    ],
                )
            )
        )
    for item in results:
        item["LLTV"] = f'{float(item["LLTV"].strip("%")) * 10**16:.0f}'
    with open(output_file, "w") as f:
        json.dump(results, f, indent=4)
    print(len(results))
