import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Numeric, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import ProgressStatus

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.execution.models.measurement import Measurement
    from app.modules.execution.models.site_visit import SiteVisit
    from app.modules.projects.models.activity import Activity


class ActivityProgress(Base):
    __tablename__ = "activity_progress"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    site_visit_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("site_visits.id", ondelete="SET NULL"), nullable=True
    )
    progress_percentage: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    status: Mapped[ProgressStatus] = mapped_column(
        Enum(ProgressStatus, name="progress_status", native_enum=False),
        default=ProgressStatus.PENDING,
        nullable=False,
    )
    progress_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reported_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "progress_percentage >= 0 AND progress_percentage <= 100",
            name="ck_activity_progress_percentage_range",
        ),
        Index("ix_activity_progress_activity_id", "activity_id"),
        Index("ix_activity_progress_site_visit_id", "site_visit_id"),
        Index("ix_activity_progress_progress_date", "progress_date"),
    )

    # Relationships
    activity: Mapped["Activity"] = relationship("Activity", back_populates="progress_records")
    site_visit: Mapped[Optional["SiteVisit"]] = relationship(
        "SiteVisit", back_populates="progress_records"
    )
    reporter: Mapped["User"] = relationship("User")
    measurements: Mapped[List["Measurement"]] = relationship(
        "Measurement", back_populates="progress"
    )
