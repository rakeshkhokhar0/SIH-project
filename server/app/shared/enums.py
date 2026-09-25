import enum


class ProjectStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class PhaseStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class ActivityStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class DependencyType(str, enum.Enum):
    FINISH_TO_START = "FINISH_TO_START"
    START_TO_START = "START_TO_START"
    FINISH_TO_FINISH = "FINISH_TO_FINISH"
    START_TO_FINISH = "START_TO_FINISH"


class MilestoneStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACHIEVED = "ACHIEVED"
    MISSED = "MISSED"
    CANCELLED = "CANCELLED"


class ScheduleStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    SUPERSEDED = "SUPERSEDED"
    ARCHIVED = "ARCHIVED"


class ProgressStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    VERIFIED = "VERIFIED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class MeasurementSource(str, enum.Enum):
    MANUAL = "MANUAL"
    DOCUMENT = "DOCUMENT"
    IMPORT = "IMPORT"
    AI = "AI"


class DocumentType(str, enum.Enum):
    BOQ = "BOQ"
    SCHEDULE = "SCHEDULE"
    CONTRACT = "CONTRACT"
    REPORT = "REPORT"
    DRAWING = "DRAWING"
    INVOICE = "INVOICE"
    OTHER = "OTHER"


class DocumentStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    ACTIVE = "ACTIVE"
    ARCHIVED = "ARCHIVED"
    DELETED = "DELETED"


class UploadStatus(str, enum.Enum):
    PENDING = "PENDING"
    UPLOADING = "UPLOADING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class EvidenceType(str, enum.Enum):
    PHOTO = "PHOTO"
    DOCUMENT = "DOCUMENT"


class ProcessingJobType(str, enum.Enum):
    OCR = "OCR"
    TEXT_EXTRACTION = "TEXT_EXTRACTION"
    TABLE_EXTRACTION = "TABLE_EXTRACTION"
    IMAGE_ANALYSIS = "IMAGE_ANALYSIS"
    EMBEDDING_GENERATION = "EMBEDDING_GENERATION"
    ACTIVITY_MATCHING = "ACTIVITY_MATCHING"


class ProcessingStatus(str, enum.Enum):
    PENDING = "PENDING"
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class ModelType(str, enum.Enum):
    OCR = "OCR"
    NLP = "NLP"
    EMBEDDING = "EMBEDDING"
    COMPUTER_VISION = "COMPUTER_VISION"
    CLASSIFICATION = "CLASSIFICATION"
    MATCHING = "MATCHING"


class RiskType(str, enum.Enum):
    SCHEDULE = "SCHEDULE"
    RESOURCE = "RESOURCE"
    MATERIAL = "MATERIAL"
    FINANCIAL = "FINANCIAL"
    WEATHER = "WEATHER"
    SAFETY = "SAFETY"
    QUALITY = "QUALITY"
    DESIGN = "DESIGN"
    APPROVAL = "APPROVAL"
    TECHNICAL = "TECHNICAL"
    OTHER = "OTHER"


class RiskSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class RiskStatus(str, enum.Enum):
    OPEN = "OPEN"
    MITIGATED = "MITIGATED"
    CLOSED = "CLOSED"
    ACCEPTED = "ACCEPTED"


class DelayType(str, enum.Enum):
    ACTIVITY = "ACTIVITY"
    MATERIAL = "MATERIAL"
    RESOURCE = "RESOURCE"
    WEATHER = "WEATHER"
    APPROVAL = "APPROVAL"
    DESIGN = "DESIGN"
    EQUIPMENT = "EQUIPMENT"
    CONTRACTOR = "CONTRACTOR"
    SITE_CONDITION = "SITE_CONDITION"
    OTHER = "OTHER"


class DelaySource(str, enum.Enum):
    MANUAL = "MANUAL"
    AI = "AI"
    SYSTEM = "SYSTEM"
    IMPORT = "IMPORT"


class DelayStatus(str, enum.Enum):
    OPEN = "OPEN"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"


class NotificationType(str, enum.Enum):
    PROJECT_UPDATE = "PROJECT_UPDATE"
    ACTIVITY_UPDATE = "ACTIVITY_UPDATE"
    DEADLINE_APPROACHING = "DEADLINE_APPROACHING"
    DELAY_DETECTED = "DELAY_DETECTED"
    RISK_DETECTED = "RISK_DETECTED"
    DOCUMENT_PROCESSED = "DOCUMENT_PROCESSED"
    PHOTO_UPLOADED = "PHOTO_UPLOADED"
    AI_MATCH_GENERATED = "AI_MATCH_GENERATED"
    COMMENT_MENTION = "COMMENT_MENTION"
    SYSTEM = "SYSTEM"


class SystemRole(str, enum.Enum):
    ADMIN = "ADMIN"
    PROJECT_MANAGER = "PROJECT_MANAGER"
    ENGINEER = "ENGINEER"
    SITE_ENGINEER = "SITE_ENGINEER"
    VIEWER = "VIEWER"
