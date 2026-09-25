from pathlib import Path
from pydantic import EmailStr,Field,HttpUrl,SecretStr,field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"

class DatabaseSettings(BaseSettings):
    DATABASE_URL:SecretStr
    DB_POOL_SIZE:int
    DB_MAX_OVERFLOW:int
    DB_POOL_TIMEOUT:int
    DB_POOL_RECYCLE:int
    DB_POOL_PRE_PING:bool
    DB_ECHO:bool

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        case_sensitive=False,
        extra="ignore",
        env_file_encoding="utf-8"
    )

databasesettings = DatabaseSettings()

class JWTSettings(BaseSettings):
    jwt_secret_key: SecretStr
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=15, gt=0)
    refresh_token_expire_days: int = Field(default=30, gt=0)

    model_config = SettingsConfigDict(
            env_file=ENV_FILE,
            env_file_encoding="utf-8",
            case_sensitive=False,
            extra="ignore",
        )

jwtsettings = JWTSettings()

class EmailSettings(BaseSettings):
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_email: EmailStr
    smtp_password: SecretStr
    frontend_url: HttpUrl = "http://localhost:5173/"
    email_verification_expire_minutes: int = Field(default=15, gt=0)

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

emailsettings = EmailSettings()

class PasswordResetSettings(BaseSettings):
    password_reset_expire_minutes: int = Field(default=15, gt=0)

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    ) 

passwordresetsettings = PasswordResetSettings()
