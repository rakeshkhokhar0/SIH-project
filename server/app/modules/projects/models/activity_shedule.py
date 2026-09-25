import uuid
from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Index, Numeric, String, UniqueConstraint, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base

if TYPE_CHECKING:
    from app.modules.projects.models.activity import Activity
    from app.modules.projects.models.schedule import Schedule


class ActivitySchedule(Base):
    __tablename__ = "activity_schedules"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    schedule_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("schedules.id", ondelete="CASCADE"), nullable=False
    )
    activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    planned_start: Mapped[date] = mapped_column(Date, nullable=False)
    planned_end: Mapped[date] = mapped_column(Date, nullable=False)
    planned_quantity: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 3), nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        UniqueConstraint("schedule_id", "activity_id", name="uq_activity_schedules_schedule_id_activity_id"),
        CheckConstraint("planned_end >= planned_start", name="ck_activity_schedules_date_order"),
        CheckConstraint("planned_quantity IS NULL OR planned_quantity >= 0", name="ck_activity_schedules_quantity_positive"),
        Index("ix_activity_schedules_schedule_id", "schedule_id"),
        Index("ix_activity_schedules_activity_id", "activity_id"),
    )

    # Relationships
    schedule: Mapped["Schedule"] = relationship("Schedule", back_populates="activity_schedules")
    activity: Mapped["Activity"] = relationship("Activity", back_populates="activity_schedules")
