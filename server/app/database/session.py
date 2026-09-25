from sqlalchemy.ext.asyncio import async_sessionmaker,AsyncSession,create_async_engine
from collections.abc import AsyncGenerator
from app.core.config import databasesettings

engine = create_async_engine(
    url=databasesettings.DATABASE_URL.get_secret_value(),
    echo=databasesettings.DB_ECHO,
    pool_size=databasesettings.DB_POOL_SIZE,
    max_overflow=databasesettings.DB_MAX_OVERFLOW,
    pool_timeout=databasesettings.DB_POOL_TIMEOUT,
    pool_recycle=databasesettings.DB_POOL_RECYCLE,
    pool_pre_ping=databasesettings.DB_POOL_PRE_PING,
)

AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

