DataSafe Locker
A secure offline password vault built with modern cryptography. DataSafe Locker encrypts and stores sensitive information using AES-256-GCM and PBKDF2 — ensuring your passwords never leave your device and remain protected even without internet access.

✅ Features
🔐 AES-256-GCM encryption
🔑 PBKDF2 key-derivation (master password-based security)
🧂 Salt & IV generation for each encryption call
💾 Secure encrypted LocalStorage vault
➕ Add, ✏️ Edit, 👁️ View, ❌ Delete entries
🔁 Built-in Encrypt / Decrypt panel
🌑🌕 Dark & Light Theme
💻 Pure client-side security — no server, no data sharing

🧠 How It Works
Step	Process
1	User creates master password
2	PBKDF2 generates AES-256 key
3	Password entries are encrypted with random IV
4	Encrypted values saved to LocalStorage
5	Decryption only happens locally after login
🔐 Security Stack
Mechanism	Why
AES-256-GCM	Modern, authenticated encryption
PBKDF2-SHA256	Strengthens master password
Random Salt	Prevents rainbow attacks
Random IV per record	Ensures unique encryption
Web Crypto API	Native browser crypto engine
📂 Project Structure
📦 DataSafe Locker
 ┣ 📜 index.html        # UI & App Layout
 ┣ 📜 style.css         # Styling & Theme
 ┣ 📜 vault.js          # Encryption + Vault Logic
 ┗ 📄 README.md

🚀 How to Run
No installation required.
Just open index.html in any modern browser.
Or deploy with GitHub Pages / Netlify / Vercel:
Upload the three files: index.html, style.css, vault.js

🧪 Tech Used
Category	Tech
Language	JavaScript
Crypto	Web Crypto API (AES-256-GCM + PBKDF2)
Storage	Encrypted LocalStorage
Front-End	HTML, CSS, Custom UI
🛡️ Why Offline Vault?
Most online password managers sync to cloud — creating breach risk.
This vault runs completely local-only:
No cloud syncing
No external servers
No tracking
Full user control of encryption keys

📌 Future Enhancements
Desktop App (Electron)
Optional secure sync (encrypted cloud backup)
Password generator
Autofill browser extension
Biometric unlock (if supported)

👨‍💻 Developed By
Tahir Aziz
Department of Information Security
The Islamia University Bahawalpur

📜 License
MIT License — you may use, modify, and distribute with credit.

⭐ If you like this project, give it a star on GitHub!
