import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, Integer, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import DelaySource, DelayStatus, DelayType, RiskSeverity

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.projects.models.activity import Activity
    from app.modules.projects.models.project import Project


class DelayEvent(Base):
    __tablename__ = "delay_events"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    activity_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    delay_type: Mapped[DelayType] = mapped_column(
        Enum(DelayType, name="delay_type", native_enum=False),
        nullable=False,
    )
    planned_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    actual_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    delay_days: Mapped[int] = mapped_column(Integer, nullable=False)
    severity: Mapped[RiskSeverity] = mapped_column(
        Enum(RiskSeverity, name="risk_severity", native_enum=False),
        nullable=False,
    )
    source: Mapped[DelaySource] = mapped_column(
        Enum(DelaySource, name="delay_source", native_enum=False),
        default=DelaySource.MANUAL,
        nullable=False,
    )
    status: Mapped[DelayStatus] = mapped_column(
        Enum(DelayStatus, name="delay_status", native_enum=False),
        default=DelayStatus.OPEN,
        nullable=False,
    )
    detected_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    resolution_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_delay_events_project_id", "project_id"),
        Index("ix_delay_events_activity_id", "activity_id"),
        Index("ix_delay_events_status", "status"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="delay_events")
    activity: Mapped[Optional["Activity"]] = relationship("Activity", back_populates="delay_events")
    detector: Mapped[Optional["User"]] = relationship("User")
