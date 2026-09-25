import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Index, Numeric, String, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import UploadStatus

if TYPE_CHECKING:
    from app.modules.ai.models.activity_match import ActivityMatch
    from app.modules.ai.models.processing_job import ProcessingJob
    from app.modules.auth.models.users import User
    from app.modules.documents.models.evidence import Evidence
    from app.modules.execution.models.site_visit import SiteVisit
    from app.modules.projects.models.project import Project


class SitePhoto(Base):
    __tablename__ = "site_photos"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    site_visit_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("site_visits.id", ondelete="RESTRICT"), nullable=False
    )
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    object_key: Mapped[str] = mapped_column(String(1024), nullable=False)
    bucket_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    checksum: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    upload_status: Mapped[UploadStatus] = mapped_column(
        Enum(UploadStatus, name="site_photo_upload_status", native_enum=False),
        default=UploadStatus.PENDING,
        nullable=False,
    )
    captured_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(9, 6), nullable=True)
    uploaded_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("object_key", name="uq_site_photos_object_key"),
        Index("ix_site_photos_project_id", "project_id"),
        Index("ix_site_photos_site_visit_id", "site_visit_id"),
        Index("ix_site_photos_captured_at", "captured_at"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="site_photos")
    site_visit: Mapped["SiteVisit"] = relationship("SiteVisit", back_populates="photos")
    uploader: Mapped["User"] = relationship("User")
    evidence: Mapped[List["Evidence"]] = relationship("Evidence", back_populates="site_photo")
    activity_matches: Mapped[List["ActivityMatch"]] = relationship(
        "ActivityMatch", back_populates="site_photo"
    )
    processing_jobs: Mapped[List["ProcessingJob"]] = relationship(
        "ProcessingJob", back_populates="site_photo"
    )
