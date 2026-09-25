import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, String, Text, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import ProjectStatus

if TYPE_CHECKING:
    from app.modules.ai.models.processing_job import ProcessingJob
    from app.modules.audit.models.audit_logs import AuditLog
    from app.modules.auth.models.organizations import Organization
    from app.modules.auth.models.project_members import ProjectMember
    from app.modules.documents.models.document import Document
    from app.modules.documents.models.site_photo import SitePhoto
    from app.modules.execution.models.site_visit import SiteVisit
    from app.modules.notifications.models.notifications import Notification
    from app.modules.projects.models.activity import Activity
    from app.modules.projects.models.comment import Comment
    from app.modules.projects.models.milestone import Milestone
    from app.modules.projects.models.phase import ProjectPhase
    from app.modules.projects.models.schedule import Schedule
    from app.modules.risk.models.delay_event import DelayEvent
    from app.modules.risk.models.risk import Risk


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("organizations.id", ondelete="RESTRICT"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    planned_end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    actual_end_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[ProjectStatus] = mapped_column(
        Enum(ProjectStatus, name="project_status", native_enum=False),
        default=ProjectStatus.PLANNED,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("organization_id", "code", name="uq_projects_organization_id_code"),
        Index("ix_projects_organization_id", "organization_id"),
    )

    # Relationships
    organization: Mapped["Organization"] = relationship("Organization", back_populates="projects")
    members: Mapped[List["ProjectMember"]] = relationship("ProjectMember", back_populates="project")
    phases: Mapped[List["ProjectPhase"]] = relationship("ProjectPhase", back_populates="project")
    activities: Mapped[List["Activity"]] = relationship("Activity", back_populates="project")
    schedules: Mapped[List["Schedule"]] = relationship("Schedule", back_populates="project")
    milestones: Mapped[List["Milestone"]] = relationship("Milestone", back_populates="project")
    site_visits: Mapped[List["SiteVisit"]] = relationship("SiteVisit", back_populates="project")
    documents: Mapped[List["Document"]] = relationship("Document", back_populates="project")
    site_photos: Mapped[List["SitePhoto"]] = relationship("SitePhoto", back_populates="project")
    processing_jobs: Mapped[List["ProcessingJob"]] = relationship("ProcessingJob", back_populates="project")
    risks: Mapped[List["Risk"]] = relationship("Risk", back_populates="project")
    delay_events: Mapped[List["DelayEvent"]] = relationship("DelayEvent", back_populates="project")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="project")
    notifications: Mapped[List["Notification"]] = relationship("Notification", back_populates="project")
    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="project")
