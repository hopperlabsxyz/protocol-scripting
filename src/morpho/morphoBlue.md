# Morpho Blue Market Parameters Scraping Scripts

This repository contains three scripts designed to gather and process market parameters from Morpho Blue.

## Scripts Overview

### 1. Market Parameters Scraper (`allVautlsMarketsDoc.py`)
- Scrapes vault and market parameters from Morpho Blue documentation
- Extracts detailed market configurations
- Generates complete marketIds for each market
- Outputs data to `allVautlsMarketsDoc.json`

### 2. Market IDs Scraper (`interface_vaults.py`)
- Scrapes active marketIds from Morpho Blue interface
- Collects currently available markets
- Outputs data to `interface_vaults.json`

### 3. Market Data Filter (`filterMarkets.py`)
- Compares data from both previous scripts
- Filters market parameters to match available marketIds
- Creates a final filtered dataset
- Outputs matched data to `finalMarkets.json`

## Usage

```bash
# Run market parameters scraper
python3 ./script_doc_all_vaults.py

# Run market IDs scraper
python3 ./script_for_interface_marketId.py

# Run market filter
python3 ./script_filter_final.py  
```

## Output Files
- `marketParams.json`: Raw market parameters and configurations
- `marketIds.json`: Available market IDs
- `finalMarkets.json`: Filtered and matched market data

## Requirements
- python3
- TypeScript
- bs4

Names need to be checked