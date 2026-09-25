import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, DateTime, Enum, ForeignKey, Index, Numeric, Text, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.shared.enums import RiskSeverity

if TYPE_CHECKING:
    from app.modules.auth.models.users import User
    from app.modules.risk.models.risk import Risk


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    risk_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("risks.id", ondelete="RESTRICT"), nullable=False
    )
    probability: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    impact: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    risk_score: Mapped[Decimal] = mapped_column(Numeric(7, 2), nullable=False)
    severity: Mapped[RiskSeverity] = mapped_column(
        Enum(RiskSeverity, name="risk_severity", native_enum=False),
        nullable=False,
    )
    assessment_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assessed_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False
    )
    assessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint("probability >= 0 AND probability <= 100", name="ck_risk_assessments_probability_range"),
        CheckConstraint("impact >= 0 AND impact <= 100", name="ck_risk_assessments_impact_range"),
        Index("ix_risk_assessments_risk_id", "risk_id"),
        Index("ix_risk_assessments_assessed_at", "assessed_at"),
    )

    # Relationships
    risk: Mapped["Risk"] = relationship("Risk", back_populates="assessments")
    assessor: Mapped["User"] = relationship("User")
