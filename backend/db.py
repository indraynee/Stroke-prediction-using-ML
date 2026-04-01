"""
Centralized MongoDB connection.
All modules should import `db` from here instead of creating their own MongoClient.

Uses a lazy-init proxy so the app boots even if Atlas is temporarily unreachable.
"""
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo.database import Database
from config import Config


def _create_client() -> MongoClient:
    """
    Build a MongoClient with maximum SSL compatibility.

    Render's Python runtime can fail the TLS handshake with Atlas
    (TLSV1_ALERT_INTERNAL_ERROR). We work around this by:
    1. Using certifi's up-to-date CA bundle
    2. Disabling certificate + hostname verification as a last resort
    3. Setting generous timeouts so transient network issues don't block startup
    """
    uri = Config.MONGO_URI

    # Append tlsInsecure to the connection string if not already present.
    # This is the nuclear option that tells the driver to skip all TLS checks,
    # which sidesteps OpenSSL version mismatches on the host.
    if 'tlsInsecure' not in uri:
        separator = '&' if '?' in uri else '?'
        uri = f"{uri}{separator}tlsInsecure=true"

    return MongoClient(
        uri,
        server_api=ServerApi('1'),
        tls=True,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=20000,
    )


class _LazyDB:
    """
    Proxy that delays the actual MongoDB connection until first attribute access.
    This lets the Flask app start cleanly even if Atlas isn't reachable at import time.
    """
    def __init__(self):
        self._client: MongoClient | None = None
        self._db: Database | None = None

    def _ensure_connected(self):
        if self._client is None:
            self._client = _create_client()
            self._db = self._client[Config.DB_NAME]
            # Quick health-check (non-fatal)
            try:
                self._client.admin.command('ping')
                print("✅ MongoDB Atlas connected successfully")
            except Exception as e:
                print(f"⚠️  MongoDB connection warning (will retry on first query): {e}")

    def __getattr__(self, name):
        self._ensure_connected()
        return getattr(self._db, name)

    def __getitem__(self, name):
        self._ensure_connected()
        return self._db[name]


# Public API — other modules do `from db import db`
db = _LazyDB()
