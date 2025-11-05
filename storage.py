import json
from pathlib import Path

data_file = Path("data/vault.json")

def load_entries():
    if not data_file.exists():
        return {}
    with open(data_file, "r") as f:
        return json.load(f)

def save_entries(data):
    with open(data_file, "w") as f:
        json.dump(data, f, indent=4)
