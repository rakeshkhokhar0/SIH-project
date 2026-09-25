import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, ForeignKey, Index, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.documents.models.site_photo import SitePhoto
    from app.modules.execution.models.activity_progress import ActivityProgress
    from app.modules.projects.models.project import Project


class SiteVisit(Base):
    __tablename__ = "site_visits"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    conducted_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    visit_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_site_visits_project_id", "project_id"),
        Index("ix_site_visits_conducted_by", "conducted_by"),
        Index("ix_site_visits_visit_date", "visit_date"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="site_visits")
    conducted_by_user: Mapped["User"] = relationship("User")
    photos: Mapped[List["SitePhoto"]] = relationship(
        "SitePhoto", back_populates="site_visit", cascade="all, delete-orphan"
    )
    progress_records: Mapped[List["ActivityProgress"]] = relationship(
        "ActivityProgress", back_populates="site_visit"
    )
