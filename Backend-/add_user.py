import asyncio
from sqlalchemy.future import select
from app.core.database import engine, AsyncSessionLocal
from app.models.user import User
from app.core.security import get_password_hash

async def add_user():
    async with AsyncSessionLocal() as session:
        email = "s6899878@gmail.com"
        password = "Simran@#$2007"
        
        # Check if user exists
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if user:
            print(f"User {email} already exists. Updating password.")
            user.hashed_password = get_password_hash(password)
        else:
            print(f"Adding user {email}.")
            user = User(
                email=email,
                name="Simran",
                hashed_password=get_password_hash(password),
                role="admin",
                is_active=True,
                is_verified=True
            )
            session.add(user)
            
        await session.commit()
        print("Done!")

if __name__ == "__main__":
    asyncio.run(add_user())
