import os, base64
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

def generate_salt():
    return os.urandom(16)

def derive_key(password: str, salt: bytes):
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    return kdf.derive(password.encode())

def hash_password(password: str, salt: bytes):
    return base64.urlsafe_b64encode(derive_key(password, salt))

def verify_password(stored_key, password: str, salt: bytes):
    stored = base64.urlsafe_b64decode(stored_key)
    derived = derive_key(password, salt)
    return stored == derived
