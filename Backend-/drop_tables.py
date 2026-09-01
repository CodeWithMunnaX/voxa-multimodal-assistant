import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import get_settings
from app.models.base import Base

settings = get_settings()

async def main():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    print("Tables dropped.")

if __name__ == "__main__":
    asyncio.run(main())
