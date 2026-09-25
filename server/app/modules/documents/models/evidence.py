import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import EvidenceType

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.documents.models.document_version import DocumentVersion
    from app.modules.documents.models.site_photo import SitePhoto
    from app.modules.projects.models.activity import Activity


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    document_version_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("document_versions.id", ondelete="CASCADE"), nullable=True
    )
    site_photo_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("site_photos.id", ondelete="CASCADE"), nullable=True
    )
    evidence_type: Mapped[EvidenceType] = mapped_column(
        Enum(EvidenceType, name="evidence_type", native_enum=False),
        nullable=False,
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "(document_version_id IS NOT NULL AND site_photo_id IS NULL) OR "
            "(document_version_id IS NULL AND site_photo_id IS NOT NULL)",
            name="ck_evidence_exactly_one_source",
        ),
        Index("ix_evidence_activity_id", "activity_id"),
        Index("ix_evidence_document_version_id", "document_version_id"),
        Index("ix_evidence_site_photo_id", "site_photo_id"),
    )

    # Relationships
    activity: Mapped["Activity"] = relationship("Activity", back_populates="evidence")
    document_version: Mapped[Optional["DocumentVersion"]] = relationship(
        "DocumentVersion", back_populates="evidence"
    )
    site_photo: Mapped[Optional["SitePhoto"]] = relationship(
        "SitePhoto", back_populates="evidence"
    )
    creator: Mapped["User"] = relationship("User")
