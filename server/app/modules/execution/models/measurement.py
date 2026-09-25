import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Numeric, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import MeasurementSource

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.execution.models.activity_progress import ActivityProgress
    from app.modules.projects.models.activity import Activity


class Measurement(Base):
    __tablename__ = "measurements"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    progress_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("activity_progress.id", ondelete="SET NULL"), nullable=True
    )
    quantity: Mapped[Decimal] = mapped_column(Numeric(18, 3), nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    measurement_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    source: Mapped[MeasurementSource] = mapped_column(
        Enum(MeasurementSource, name="measurement_source", native_enum=False),
        default=MeasurementSource.MANUAL,
        nullable=False,
    )
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    recorded_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint("quantity >= 0", name="ck_measurements_quantity_non_negative"),
        Index("ix_measurements_activity_id", "activity_id"),
        Index("ix_measurements_measurement_date", "measurement_date"),
    )

    # Relationships
    activity: Mapped["Activity"] = relationship("Activity", back_populates="measurements")
    progress: Mapped[Optional["ActivityProgress"]] = relationship(
        "ActivityProgress", back_populates="measurements"
    )
    recorder: Mapped["User"] = relationship("User")
