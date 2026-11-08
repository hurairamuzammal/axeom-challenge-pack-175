"""Vercel Serverless Function Entrypoint for Axeom Operations Engine (Pack 175).

Vercel's Python runtime natively executes subclasses of BaseHTTPRequestHandler named `handler`.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.server import AxeomRequestHandler


class handler(AxeomRequestHandler):
    """Vercel Python Serverless handler."""
    pass

