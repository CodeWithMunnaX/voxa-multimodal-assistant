import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import get_settings

settings = get_settings()

async def main():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        await conn.execute(text("DROP TABLE IF EXISTS alembic_version;"))
    await engine.dispose()
    print("Alembic version table dropped.")

if __name__ == "__main__":
    asyncio.run(main())
