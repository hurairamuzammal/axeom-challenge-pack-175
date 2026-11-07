"""HTTP & REST API Server for Axeom Operations & Financial Reconciliation Engine (Pack 175).

Zero external package dependencies (uses Python 3.12 standard library http.server, json, sqlite3).
Serves the mobile-first web application and exposes reactive API endpoints:
- GET  /api/state                  -> Full 5-Module reactive state
- POST /api/upload                 -> Upload 1 or more CSV / messages.txt files, validate, persist & recompute
- POST /api/spam-action            -> Module 1 Spam Audit Log action (RESTORE or DELETE lead_id)
- POST /api/owner-decision         -> Module 2/3/5 Owner confirmation card action (Suggest, Never Act Alone)
- POST /api/approve-revision-sync  -> Module 4 Approve Jev revision note sync to production_board
- POST /api/submit-intake          -> Module 4 Structured Client Revision / Booking / Billing Intake
- POST /api/reset                  -> Reset SQLite state to baseline raw dataset
"""

from __future__ import annotations

import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

from app.engine import DEFAULT_RAW_DATA_DIR, AxeomReactiveEngine
from app.ingestion import parse_csv_content, parse_messages_content
from app.storage import StateStorage


STATIC_DIR = Path(__file__).resolve().parent / "static"


class AxeomRequestHandler(BaseHTTPRequestHandler):
    """Thread-safe HTTP request handler for the Axeom Operations Engine."""

    engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, StateStorage())

    def _send_json(self, payload: Dict[str, Any], status_code: int = 200) -> None:
        raw = json.dumps(payload, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(raw)

    def _read_json_body(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0") or "0")
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw) if raw else {}

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/state":
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        if path == "/api/health":
            self._send_json({"status": "ok", "reference_date": "2026-10-06", "pack_id": "175"})
            return

        # Serve static frontend assets
        if path == "/" or path == "":
            target = STATIC_DIR / "index.html"
        else:
            rel = path.lstrip("/")
            target = (STATIC_DIR / rel).resolve()
            if not str(target).startswith(str(STATIC_DIR.resolve())):
                self._send_json({"error": "Forbidden"}, status_code=403)
                return

        if target.exists() and target.is_file():
            ctype, _ = mimetypes.guess_type(str(target))
            data = target.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", ctype or "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            self._send_json({"error": f"Path '{path}' not found"}, status_code=404)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        path = parsed.path
        try:
            body = self._read_json_body()
        except Exception as exc:
            self._send_json({"error": f"Invalid JSON payload: {exc}"}, status_code=400)
            return

        if path == "/api/upload":
            # Accepts {"files": [{"filename": "invoices.csv", "content": "..."}]}
            files = body.get("files", [])
            upload_errors = []
            saved_files = []
            for fitem in files:
                fname = (fitem.get("filename") or "").strip()
                content = fitem.get("content") or ""
                if not fname:
                    continue
                if fname.lower().endswith(".txt") or "message" in fname.lower():
                    msgs, errs = parse_messages_content(content, source_filename=fname)
                    upload_errors.extend([e.to_dict() for e in errs])
                    if msgs and not any(e.severity == "ERROR" for e in errs):
                        self.engine.storage.save_uploaded_file(fname, content)
                        saved_files.append(fname)
                else:
                    _, rows, errs = parse_csv_content(content, source_filename=fname)
                    upload_errors.extend([e.to_dict() for e in errs])
                    if rows and not any(e.severity == "ERROR" for e in errs):
                        self.engine.storage.save_uploaded_file(fname, content)
                        saved_files.append(fname)

            state = self.engine.run_pipeline()
            state["latest_upload_result"] = {
                "saved_files": saved_files,
                "upload_validation_errors": upload_errors,
            }
            self._send_json(state)
            return

        if path == "/api/spam-action":
            lead_id = (body.get("lead_id") or "").strip()
            action = (body.get("action") or "").strip().upper()
            if lead_id and action in ("RESTORE", "DELETE"):
                self.engine.storage.set_spam_override(lead_id, action)
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        if path == "/api/owner-decision":
            key = (body.get("decision_key") or "").strip()
            val = (body.get("decision_value") or "").strip()
            if key and val:
                self.engine.storage.set_owner_decision(key, val)
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        if path == "/api/approve-revision-sync":
            msg_id = (body.get("message_id") or "").strip()
            approved = bool(body.get("approved", True))
            if msg_id:
                self.engine.storage.approve_revision_sync(msg_id, approved)
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        if path == "/api/submit-intake":
            intake_payload = {
                "pathway": body.get("pathway", "1. Submit Video Revision"),
                "client_email": body.get("client_email", ""),
                "client_name": body.get("client_name", ""),
                "video_id": (body.get("video_id") or "").upper().strip(),
                "category": body.get("category", "Cut/Trimming"),
                "notes": body.get("notes", ""),
                "approved": bool(body.get("approved", True)),
            }
            self.engine.storage.add_custom_intake(intake_payload)
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        if path == "/api/reset":
            self.engine.storage.reset_all_state()
            state = self.engine.run_pipeline()
            self._send_json(state)
            return

        self._send_json({"error": f"Unknown endpoint '{path}'"}, status_code=404)

    def log_message(self, format: str, *args: Any) -> None:
        return


def generate_static_baseline_snapshot() -> Path:
    """Export baseline state JSON to app/static/baseline_state.json for static hosting fallback."""
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    engine = AxeomReactiveEngine(DEFAULT_RAW_DATA_DIR, StateStorage())
    state = engine.run_pipeline()
    out_path = STATIC_DIR / "baseline_state.json"
    out_path.write_text(json.dumps(state, indent=2), encoding="utf-8")
    return out_path


def run_server(host: str = "127.0.0.1", port: int = 8501) -> None:
    generate_static_baseline_snapshot()
    server = ThreadingHTTPServer((host, port), AxeomRequestHandler)
    print(f"Axeom Operations Engine listening on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    port_num = int(os.environ.get("PORT", "8501"))
    run_server(host="0.0.0.0", port=port_num)

