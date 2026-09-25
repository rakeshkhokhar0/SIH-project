import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Integer, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import DependencyType

if TYPE_CHECKING:
    from app.modules.projects.models.activity import Activity


class ActivityDependency(Base):
    __tablename__ = "activity_dependencies"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    predecessor_activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    successor_activity_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="RESTRICT"), nullable=False
    )
    dependency_type: Mapped[DependencyType] = mapped_column(
        Enum(DependencyType, name="dependency_type", native_enum=False),
        default=DependencyType.FINISH_TO_START,
        nullable=False,
    )
    lag_days: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint(
            "predecessor_activity_id != successor_activity_id",
            name="ck_activity_dependencies_no_self_dep",
        ),
        Index("ix_activity_dependencies_predecessor_activity_id", "predecessor_activity_id"),
        Index("ix_activity_dependencies_successor_activity_id", "successor_activity_id"),
    )

    # Relationships
    predecessor_activity: Mapped["Activity"] = relationship(
        "Activity",
        foreign_keys=[predecessor_activity_id],
        back_populates="predecessor_dependencies",
    )
    successor_activity: Mapped["Activity"] = relationship(
        "Activity",
        foreign_keys=[successor_activity_id],
        back_populates="successor_dependencies",
    )
