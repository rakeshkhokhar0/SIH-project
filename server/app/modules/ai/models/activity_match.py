import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Any, Dict, Optional

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Index, Integer, Numeric, String, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.modules.ai.models.ai_model_version import AIModelVersion
    from app.modules.ai.models.processing_job import ProcessingJob
    from app.modules.documents.models.site_photo import SitePhoto
    from app.modules.projects.models.activity import Activity


class ActivityMatch(Base):
    __tablename__ = "activity_matches"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    site_photo_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("site_photos.id", ondelete="RESTRICT"), nullable=False
    )
    activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    model_version_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("ai_model_versions.id", ondelete="RESTRICT"), nullable=False
    )
    processing_job_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("processing_jobs.id", ondelete="SET NULL"), nullable=True
    )
    confidence_score: Mapped[Decimal] = mapped_column(Numeric(6, 5), nullable=False)
    rank: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    match_method: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    match_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "confidence_score >= 0 AND confidence_score <= 1",
            name="ck_activity_matches_confidence_score_range",
        ),
        Index("ix_activity_matches_site_photo_id", "site_photo_id"),
        Index("ix_activity_matches_activity_id", "activity_id"),
    )

    # Relationships
    site_photo: Mapped["SitePhoto"] = relationship("SitePhoto", back_populates="activity_matches")
    activity: Mapped["Activity"] = relationship("Activity", back_populates="matches")
    model_version: Mapped["AIModelVersion"] = relationship(
        "AIModelVersion", back_populates="activity_matches"
    )
    processing_job: Mapped[Optional["ProcessingJob"]] = relationship(
        "ProcessingJob", back_populates="activity_matches"
    )
