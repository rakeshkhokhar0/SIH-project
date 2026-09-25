import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Numeric, String, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import RiskSeverity, RiskStatus, RiskType

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.projects.models.activity import Activity
    from app.modules.projects.models.project import Project
    from app.modules.risk.models.risk_assessment import RiskAssessment


class Risk(Base):
    __tablename__ = "risks"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    project_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("projects.id", ondelete="RESTRICT"), nullable=False
    )
    activity_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("activities.id", ondelete="SET NULL"), nullable=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    risk_type: Mapped[RiskType] = mapped_column(
        Enum(RiskType, name="risk_type", native_enum=False),
        nullable=False,
    )
    probability: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    impact: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    risk_score: Mapped[Decimal] = mapped_column(Numeric(7, 2), nullable=False)
    severity: Mapped[RiskSeverity] = mapped_column(
        Enum(RiskSeverity, name="risk_severity", native_enum=False),
        nullable=False,
    )
    status: Mapped[RiskStatus] = mapped_column(
        Enum(RiskStatus, name="risk_status", native_enum=False),
        default=RiskStatus.OPEN,
        nullable=False,
    )
    identified_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    identified_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    mitigation_plan: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint("probability >= 0 AND probability <= 100", name="ck_risks_probability_range"),
        CheckConstraint("impact >= 0 AND impact <= 100", name="ck_risks_impact_range"),
        Index("ix_risks_project_id", "project_id"),
        Index("ix_risks_activity_id", "activity_id"),
        Index("ix_risks_status", "status"),
    )

    # Relationships
    project: Mapped["Project"] = relationship("Project", back_populates="risks")
    activity: Mapped[Optional["Activity"]] = relationship("Activity", back_populates="risks")
    identifier: Mapped["User"] = relationship("User")
    assessments: Mapped[List["RiskAssessment"]] = relationship(
        "RiskAssessment", back_populates="risk"
    )
