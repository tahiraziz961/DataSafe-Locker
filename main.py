import json
from pathlib import Path
from getpass import getpass
from utils import generate_salt, hash_password, verify_password, derive_key
from encryption import encrypt_data, decrypt_data
from storage import load_entries, save_entries

master_file = Path("data/master.json")

def create_master():
    password = getpass("Create master password: ")
    salt = generate_salt()
    key = hash_password(password, salt)
    with open(master_file, "w") as f:
        json.dump({"salt": salt.hex(), "key": key.decode()}, f)
    print("✅ Master password created!")

def login():
    with open(master_file, "r") as f:
        data = json.load(f)

    attempts = 3
    while attempts > 0:
        password = getpass("Enter master password: ")

        if verify_password(data["key"], password, bytes.fromhex(data["salt"])):
            print("✅ Login successful!")
            return derive_key(password, bytes.fromhex(data["salt"]))

        attempts -= 1
        print(f"❌ Wrong password! {attempts} attempts left.")

    print("🚫 Too many failed attempts. Exiting.")
    exit()

def main_menu(key):
    while True:
        print("\n🔐 DataSafe Locker")
        print("1️⃣  Add entry")
        print("2️⃣  View entries")
        print("3️⃣  Delete entry")
        print("4️⃣  Exit")

        choice = input("Select: ")
        entries = load_entries()

        if choice == "1":
            name = input("Label: ")
            secret = getpass("Data: ")  # hide secret input too
            entries[name] = encrypt_data(key, secret)
            save_entries(entries)
            print("✅ Saved!")

        elif choice == "2":
            if not entries:
                print("📭 Vault is empty!")
            else:
                for label, enc in entries.items():
                    print(f"{label}: {decrypt_data(key, enc)}")

        elif choice == "3":
            name = input("Enter label to delete: ")
            if name in entries:
                del entries[name]
                save_entries(entries)
                print("🗑️ Deleted successfully!")
            else:
                print("⚠ Entry not found!")

        elif choice == "4":
            print("👋 Bye!")
            break

        else:
            print("⚠ Invalid option!")

if __name__ == "__main__":
    if not master_file.exists():
        create_master()
        key = login()
    else:
        key = login()

    main_menu(key)
