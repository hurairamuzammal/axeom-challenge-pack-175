"""End-to-End Reactive Pipeline Orchestrator for Axeom Operations Engine (Pack 175)."""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from typing import Any, Dict, Optional

from app import BUSINESS_DATE
from app.business_logic import compute_business_state
from app.cleaning import clean_and_normalize_dataset
from app.ingestion import load_raw_data_directory
from app.reconciliation import resolve_identities_and_reconcile
from app.storage import StateStorage


DEFAULT_RAW_DATA_DIR = (
    Path(__file__).resolve().parent.parent / "Axeom Challenge - Pack 175" / "data"
)


def _json_safe(obj: Any) -> Any:
    """Recursively convert date/datetime/set objects into JSON-serializable primitives."""
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    if isinstance(obj, set):
        return sorted(list(obj))
    if isinstance(obj, dict):
        return {str(k): _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(x) for x in obj]
    return obj


class AxeomReactiveEngine:
    """Reactive operations engine that recalculates all 5 modules on file upload or owner action."""

    def __init__(
        self,
        raw_data_dir: str | Path = DEFAULT_RAW_DATA_DIR,
        storage: Optional[StateStorage] = None,
    ) -> None:
        self.raw_data_dir = Path(raw_data_dir)
        self.storage = storage or StateStorage()

    def run_pipeline(
        self,
        extra_files_override: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Execute Ingestion -> Cleaning -> Identity Resolution -> Reconciliation -> Business Logic."""
        persisted_files = self.storage.get_uploaded_files()
        if extra_files_override:
            persisted_files.update(extra_files_override)

        restored_leads, deleted_leads = self.storage.get_spam_overrides()
        owner_decisions = self.storage.get_owner_decisions()
        approved_revs = self.storage.get_approved_revision_syncs()
        custom_intakes = self.storage.get_custom_intakes()

        # Layer 1: Raw File Ingestion & Schema Validation
        ingested = load_raw_data_directory(
            self.raw_data_dir,
            extra_uploaded_files=persisted_files,
        )

        # Layer 2: Multi-Format Date Normalization & Soft Spam Filtering
        cleaned = clean_and_normalize_dataset(
            ingested,
            restored_lead_ids=restored_leads,
            deleted_lead_ids=deleted_leads,
        )

        # Layer 3: Three-Tier Identity Resolution & 4-Pass Payment Reconciliation
        reconciled = resolve_identities_and_reconcile(
            cleaned,
            owner_decisions=owner_decisions,
        )

        # Layer 4: Business Logic, Balance Guards, Jev Extraction & KPI Computation
        state = compute_business_state(
            cleaned=cleaned,
            reconciled=reconciled,
            owner_decisions=owner_decisions,
            approved_revision_syncs=approved_revs,
            custom_revision_intakes=custom_intakes,
            reference_date=BUSINESS_DATE,
        )

        state["persisted_uploads"] = list(persisted_files.keys())
        state["custom_intakes"] = custom_intakes
        return _json_safe(state)

