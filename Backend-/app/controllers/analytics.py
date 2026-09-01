from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/usage")
async def get_usage(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Calculate usage for the last 7 days
    today = datetime.utcnow().date()
    start_date = today - timedelta(days=6)
    
    # Query all chats for the user
    chats_query = select(Chat.id).where(Chat.user_id == current_user.id)
    chats_result = await db.execute(chats_query)
    chat_ids = [row[0] for row in chats_result.all()]
    
    # Initialize data structure for 7 days
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    usage_data = []
    
    # Generate the last 7 days (including today)
    date_map = {}
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        day_name = days[d.weekday()]
        date_map[d.isoformat()] = {"name": day_name, "queries": 0, "storage": 0}
        usage_data.append(date_map[d.isoformat()])
        
    if chat_ids:
        # Query messages in the last 7 days
        # We use naive datetime if the db stores naive datetimes, which TimestampMixin usually does
        start_datetime = datetime.combine(start_date, datetime.min.time())
        messages_query = select(Message).where(
            Message.chat_id.in_(chat_ids),
            Message.created_at >= start_datetime,
            Message.role == "user" # Count user queries
        )
        messages_result = await db.execute(messages_query)
        messages = messages_result.scalars().all()
        
        # Group by day
        for msg in messages:
            msg_date = msg.created_at.date().isoformat()
            if msg_date in date_map:
                date_map[msg_date]["queries"] += 1
                
    # Return in the exact format the frontend expects
    return {"success": True, "data": usage_data}
