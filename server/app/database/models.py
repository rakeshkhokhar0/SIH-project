"""
Central model registration module for SIH Database Schema V1.
Importing this module ensures all 28 SQLAlchemy ORM models are registered
with Base.metadata.
"""

from app.modules.ai.models.activity_match import ActivityMatch
from app.modules.ai.models.ai_model_version import AIModelVersion
from app.modules.ai.models.processing_job import ProcessingJob
from app.modules.audit.models.audit_logs import AuditLog
from app.modules.auth.models.organizations import Organization
from app.modules.auth.models.project_members import ProjectMember
from app.modules.auth.models.roles import Role
from app.modules.auth.models.user_roles import UserRole
from app.modules.auth.models.users import User
from app.modules.documents.models.document import Document
from app.modules.documents.models.document_version import DocumentVersion
from app.modules.documents.models.evidence import Evidence
from app.modules.documents.models.site_photo import SitePhoto
from app.modules.execution.models.activity_progress import ActivityProgress
from app.modules.execution.models.measurement import Measurement
from app.modules.execution.models.site_visit import SiteVisit
from app.modules.notifications.models.notifications import Notification
from app.modules.projects.models.activity import Activity
from app.modules.projects.models.activity_shedule import ActivitySchedule
from app.modules.projects.models.comment import Comment
from app.modules.projects.models.dependency import ActivityDependency
from app.modules.projects.models.milestone import Milestone
from app.modules.projects.models.phase import ProjectPhase
from app.modules.projects.models.project import Project
from app.modules.projects.models.schedule import Schedule
from app.modules.risk.models.delay_event import DelayEvent
from app.modules.risk.models.risk import Risk
from app.modules.risk.models.risk_assessment import RiskAssessment

__all__ = [
    # Auth / Identity (5)
    "Organization",
    "User",
    "Role",
    "UserRole",
    "ProjectMember",
    # Project Structure (3)
    "Project",
    "ProjectPhase",
    "Activity",
    # Planning / Scheduling (4)
    "ActivityDependency",
    "Milestone",
    "Schedule",
    "ActivitySchedule",
    # Execution (3)
    "SiteVisit",
    "ActivityProgress",
    "Measurement",
    # Documents / Evidence (4)
    "Document",
    "DocumentVersion",
    "SitePhoto",
    "Evidence",
    # AI (3)
    "ProcessingJob",
    "AIModelVersion",
    "ActivityMatch",
    # Risk / Delay (3)
    "Risk",
    "RiskAssessment",
    "DelayEvent",
    # Cross-Cutting (3)
    "AuditLog",
    "Notification",
    "Comment",
]
