import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import ActivityStatus

if TYPE_CHECKING:
    from app.modules.ai.models.activity_match import ActivityMatch
    from app.modules.documents.models.evidence import Evidence
    from app.modules.execution.models.activity_progress import ActivityProgress
    from app.modules.execution.models.measurement import Measurement
    from app.modules.projects.models.activity_shedule import ActivitySchedule
    from app.modules.projects.models.dependency import ActivityDependency
    from app.modules.projects.models.milestone import Milestone
    from app.modules.projects.models.phase import ProjectPhase
    from app.modules.projects.models.project import Project
    from app.modules.risk.models.delay_event import DelayEvent
    from app.modules.risk.models.risk import Risk


class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    phase_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("project_phases.id", ondelete="SET NULL"), nullable=True
    )
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ActivityStatus] = mapped_column(
        Enum(ActivityStatus, name="activity_status", native_enum=False),
        default=ActivityStatus.PLANNED,
        nullable=False,
    )
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_activities_project_id", "project_id"),
        Index("ix_activities_phase_id", "phase_id"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="activities")
    phase: Mapped[Optional["ProjectPhase"]] = relationship("ProjectPhase", back_populates="activities")
    predecessor_dependencies: Mapped[List["ActivityDependency"]] = relationship(
        "ActivityDependency",
        foreign_keys="ActivityDependency.predecessor_activity_id",
        back_populates="predecessor_activity",
    )
    successor_dependencies: Mapped[List["ActivityDependency"]] = relationship(
        "ActivityDependency",
        foreign_keys="ActivityDependency.successor_activity_id",
        back_populates="successor_activity",
    )
    milestones: Mapped[List["Milestone"]] = relationship("Milestone", back_populates="activity")
    activity_schedules: Mapped[List["ActivitySchedule"]] = relationship(
        "ActivitySchedule", back_populates="activity"
    )
    progress_records: Mapped[List["ActivityProgress"]] = relationship(
        "ActivityProgress", back_populates="activity"
    )
    measurements: Mapped[List["Measurement"]] = relationship("Measurement", back_populates="activity")
    evidence: Mapped[List["Evidence"]] = relationship("Evidence", back_populates="activity")
    matches: Mapped[List["ActivityMatch"]] = relationship("ActivityMatch", back_populates="activity")
    risks: Mapped[List["Risk"]] = relationship("Risk", back_populates="activity")
    delay_events: Mapped[List["DelayEvent"]] = relationship("DelayEvent", back_populates="activity")
