import json
import time
import requests
from pathlib import Path

INPUT_FILE = Path("dataSet/destinations_final.json")
OUTPUT_FILE = Path("dataSet/destinations_geocoded.json")
CACHE_FILE = Path("dataSet/nominatim_cache.json")

URL = "https://nominatim.openstreetmap.org/reverse"

HEADERS = {
    "User-Agent": "BharathTrails/1.0 (bharath-trails-project)"
}

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    destinations = json.load(f)

if CACHE_FILE.exists():
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
else:
    cache = {}

print(f"Loaded {len(destinations)} destinations")

for i, d in enumerate(destinations, 1):

    coords = d["location"]["coordinates"]["coordinates"]
    lon, lat = coords

    key = f"{lat:.6f},{lon:.6f}"

    if key in cache:
        result = cache[key]
    else:
        print(f"[{i}/328] {d['name']}")

        params = {
            "lat": lat,
            "lon": lon,
            "format": "geocodejson",
            "addressdetails": 1,
            "accept-language": "en"
        }

        response = requests.get(
            URL,
            params=params,
            headers=HEADERS,
            timeout=20
        )

        response.raise_for_status()

        result = response.json()
        cache[key] = result

        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False)

        time.sleep(1.1)

    geo = (
        result
        .get("features", [{}])[0]
        .get("properties", {})
        .get("geocoding", {})
    )

    city = (
        geo.get("city")
        or geo.get("town")
        or geo.get("village")
        or geo.get("municipality")
    )

    d["location"]["nearestCity"] = city

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(destinations, f, ensure_ascii=False, indent=2)

print("\nDONE!")
print(f"Saved: {OUTPUT_FILE}")