"""SQLite Persistence Layer for Uploaded Files, Owner Decisions, and Revision Syncs.

Ensures uploaded CSV/TXT files and owner confirmation choices persist across reloads
without ever modifying the raw baseline files in 'Axeom Challenge - Pack 175/data/'.
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple


DEFAULT_DB_PATH = (
    Path("/tmp/axeom_state.db")
    if os.environ.get("VERCEL")
    else Path(__file__).resolve().parent / "axeom_state.db"
)


class StateStorage:
    """SQLite-backed state store for dynamic uploads, spam audit overrides, and owner decisions."""

    def __init__(self, db_path: str | Path = DEFAULT_DB_PATH) -> None:
        self.db_path = str(db_path)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS uploaded_files (
                    filename TEXT PRIMARY KEY,
                    content TEXT NOT NULL,
                    uploaded_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS owner_decisions (
                    decision_key TEXT PRIMARY KEY,
                    decision_value TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS spam_overrides (
                    lead_id TEXT PRIMARY KEY,
                    override_action TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS revision_syncs (
                    message_id TEXT PRIMARY KEY,
                    approved INTEGER NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS custom_intakes (
                    intake_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    payload_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.commit()

    def save_uploaded_file(self, filename: str, content: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO uploaded_files (filename, content, uploaded_at)
                VALUES (?, ?, ?)
                ON CONFLICT(filename) DO UPDATE SET
                    content = excluded.content,
                    uploaded_at = excluded.uploaded_at
                """,
                (filename, content, now),
            )
            conn.commit()

    def get_uploaded_files(self) -> Dict[str, str]:
        with self._connect() as conn:
            rows = conn.execute("SELECT filename, content FROM uploaded_files ORDER BY uploaded_at ASC").fetchall()
            return {r["filename"]: r["content"] for r in rows}

    def set_owner_decision(self, key: str, value: str) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO owner_decisions (decision_key, decision_value, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(decision_key) DO UPDATE SET
                    decision_value = excluded.decision_value,
                    updated_at = excluded.updated_at
                """,
                (key, value, now),
            )
            conn.commit()

    def get_owner_decisions(self) -> Dict[str, str]:
        with self._connect() as conn:
            rows = conn.execute("SELECT decision_key, decision_value FROM owner_decisions").fetchall()
            return {r["decision_key"]: r["decision_value"] for r in rows}

    def set_spam_override(self, lead_id: str, action: str) -> None:
        """action is 'RESTORE' or 'DELETE'."""
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO spam_overrides (lead_id, override_action, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(lead_id) DO UPDATE SET
                    override_action = excluded.override_action,
                    updated_at = excluded.updated_at
                """,
                (lead_id, action.upper(), now),
            )
            conn.commit()

    def get_spam_overrides(self) -> Tuple[Set[str], Set[str]]:
        restored: Set[str] = set()
        deleted: Set[str] = set()
        with self._connect() as conn:
            rows = conn.execute("SELECT lead_id, override_action FROM spam_overrides").fetchall()
            for r in rows:
                if r["override_action"] == "RESTORE":
                    restored.add(r["lead_id"])
                elif r["override_action"] == "DELETE":
                    deleted.add(r["lead_id"])
        return restored, deleted

    def approve_revision_sync(self, message_id: str, approved: bool = True) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO revision_syncs (message_id, approved, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(message_id) DO UPDATE SET
                    approved = excluded.approved,
                    updated_at = excluded.updated_at
                """,
                (message_id, 1 if approved else 0, now),
            )
            conn.commit()

    def get_approved_revision_syncs(self) -> Set[str]:
        with self._connect() as conn:
            rows = conn.execute("SELECT message_id FROM revision_syncs WHERE approved = 1").fetchall()
            return {r["message_id"] for r in rows}

    def add_custom_intake(self, payload: Dict[str, Any]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO custom_intakes (payload_json, created_at) VALUES (?, ?)",
                (json.dumps(payload), now),
            )
            conn.commit()

    def get_custom_intakes(self) -> List[Dict[str, Any]]:
        with self._connect() as conn:
            rows = conn.execute("SELECT intake_id, payload_json, created_at FROM custom_intakes ORDER BY intake_id ASC").fetchall()
            items: List[Dict[str, Any]] = []
            for r in rows:
                data = json.loads(r["payload_json"])
                data["intake_id"] = r["intake_id"]
                data["created_at"] = r["created_at"]
                items.append(data)
            return items

    def reset_all_state(self) -> None:
        with self._connect() as conn:
            conn.execute("DELETE FROM uploaded_files")
            conn.execute("DELETE FROM owner_decisions")
            conn.execute("DELETE FROM spam_overrides")
            conn.execute("DELETE FROM revision_syncs")
            conn.execute("DELETE FROM custom_intakes")
            conn.commit()

