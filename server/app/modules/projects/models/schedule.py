import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, Integer, String, Text, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import ScheduleStatus

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.projects.models.activity_shedule import ActivitySchedule
    from app.modules.projects.models.project import Project


class Schedule(Base):
    __tablename__ = "schedules"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[ScheduleStatus] = mapped_column(
        Enum(ScheduleStatus, name="schedule_status", native_enum=False),
        default=ScheduleStatus.DRAFT,
        nullable=False,
    )
    effective_from: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("project_id", "version", name="uq_schedules_project_id_version"),
        Index("ix_schedules_project_id", "project_id"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="schedules")
    creator: Mapped["User"] = relationship("User")
    activity_schedules: Mapped[List["ActivitySchedule"]] = relationship(
        "ActivitySchedule", back_populates="schedule", cascade="all, delete-orphan"
    )
