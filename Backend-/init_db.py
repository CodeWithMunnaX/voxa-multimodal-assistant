import asyncio
from app.core.database import engine
from app.models.base import Base
# Import all models here so metadata is registered
from app.models.user import User
from app.models.message import Message

async def init_db():
    async with engine.begin() as conn:
        print("Creating all tables (MVC structure)...")
        await conn.run_sync(Base.metadata.create_all)
        print("Done!")

if __name__ == "__main__":
    asyncio.run(init_db())
