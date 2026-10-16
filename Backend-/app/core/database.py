from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings

settings = get_settings()


def to_asyncpg_url(url: str) -> tuple[str, dict]:
    """Accept a plain Postgres URL (e.g. copied from Neon) and adapt it for asyncpg.

    asyncpg doesn't understand libpq params like sslmode/channel_binding, so SSL is
    passed via connect_args instead.
    """
    if not url.startswith(("postgres://", "postgresql://", "postgresql+asyncpg://")):
        return url, {}
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query))
    sslmode = query.pop("sslmode", None)
    ssl = query.pop("ssl", None)
    query.pop("channel_binding", None)
    clean = urlunsplit(("postgresql+asyncpg", parts.netloc, parts.path, urlencode(query), parts.fragment))
    connect_args = {"ssl": "require"} if sslmode in ("require", "verify-ca", "verify-full") or ssl == "require" else {}
    if "-pooler." in parts.netloc:
        # PgBouncer in transaction mode can't use asyncpg's prepared statement cache
        connect_args["statement_cache_size"] = 0
    return clean, connect_args


db_url, connect_args = to_asyncpg_url(settings.DATABASE_URL or "sqlite+aiosqlite:///:memory:")

engine_kwargs = {"echo": settings.ENVIRONMENT == "development", "connect_args": connect_args}
if not db_url.startswith("sqlite"):
    engine_kwargs.update(pool_size=5, max_overflow=5, pool_pre_ping=True, pool_recycle=300)

engine = create_async_engine(db_url, **engine_kwargs)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
