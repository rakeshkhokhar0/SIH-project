import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Text, Uuid, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import ProcessingJobType, ProcessingStatus

if TYPE_CHECKING:
    from app.modules.ai.models.activity_match import ActivityMatch
    from app.modules.auth.models.users import User
    from app.modules.documents.models.document_version import DocumentVersion
    from app.modules.documents.models.site_photo import SitePhoto
    from app.modules.projects.models.project import Project


class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    document_version_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("document_versions.id", ondelete="RESTRICT"), nullable=True
    )
    site_photo_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("site_photos.id", ondelete="RESTRICT"), nullable=True
    )
    job_type: Mapped[ProcessingJobType] = mapped_column(
        Enum(ProcessingJobType, name="processing_job_type", native_enum=False),
        nullable=False,
    )
    status: Mapped[ProcessingStatus] = mapped_column(
        Enum(ProcessingStatus, name="processing_status", native_enum=False),
        default=ProcessingStatus.PENDING,
        nullable=False,
    )
    input_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    output_metadata: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "(document_version_id IS NOT NULL AND site_photo_id IS NULL) OR "
            "(document_version_id IS NULL AND site_photo_id IS NOT NULL)",
            name="ck_processing_jobs_exactly_one_input",
        ),
        Index("ix_processing_jobs_project_id", "project_id"),
        Index("ix_processing_jobs_status", "status"),
        Index("ix_processing_jobs_created_at", "created_at"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="processing_jobs")
    document_version: Mapped[Optional["DocumentVersion"]] = relationship(
        "DocumentVersion", back_populates="processing_jobs"
    )
    site_photo: Mapped[Optional["SitePhoto"]] = relationship(
        "SitePhoto", back_populates="processing_jobs"
    )
    creator: Mapped[Optional["User"]] = relationship("User")
    activity_matches: Mapped[List["ActivityMatch"]] = relationship(
        "ActivityMatch", back_populates="processing_job"
    )
