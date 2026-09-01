from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.message import Message
from app.views.chat import (
    ChatCreate, ChatRequest, StandardChatResponse, 
    StandardChatsResponse, StandardMessageResponse, ChatResponse
)
from app.services.ai import ai_service
from app.core.limiter import limiter

router = APIRouter(prefix="/api/chats", tags=["Chats"])

@router.post("", response_model=StandardChatResponse, status_code=status.HTTP_201_CREATED)
async def create_chat(chat_in: ChatCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_chat = Chat(user_id=current_user.id, title=chat_in.title)
    db.add(new_chat)
    await db.commit()
    
    # Eager load messages to prevent MissingGreenlet error during Pydantic serialization
    query = select(Chat).options(selectinload(Chat.messages)).where(Chat.id == new_chat.id)
    result = await db.execute(query)
    chat_with_messages = result.scalars().first()
    
    return StandardChatResponse(data=ChatResponse.model_validate(chat_with_messages))

@router.get("", response_model=StandardChatsResponse)
async def list_chats(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = select(Chat).options(selectinload(Chat.messages)).where(Chat.user_id == current_user.id).order_by(Chat.created_at.desc())
    result = await db.execute(query)
    chats = result.scalars().all()
    return StandardChatsResponse(data=[ChatResponse.model_validate(c) for c in chats])

@router.get("/{chat_id}", response_model=StandardChatResponse)
async def get_chat(chat_id: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = select(Chat).options(selectinload(Chat.messages)).where(Chat.id == chat_id, Chat.user_id == current_user.id)
    result = await db.execute(query)
    chat = result.scalars().first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return StandardChatResponse(data=ChatResponse.model_validate(chat))

@router.post("/{chat_id}/messages", response_model=StandardMessageResponse)
@limiter.limit("20/minute")
async def send_message(
    request: Request,
    chat_id: str, 
    chat_req: ChatRequest, 
    db: AsyncSession = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    query = select(Chat).options(selectinload(Chat.messages)).where(Chat.id == chat_id, Chat.user_id == current_user.id)
    result = await db.execute(query)
    chat = result.scalars().first()
    
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    # 1. Save user message
    user_msg = Message(chat_id=chat.id, role="user", content=chat_req.message)
    db.add(user_msg)
    
    # 2. Call Gemini API
    # We pass the history from chat.messages
    ai_response_text = await ai_service.generate_response(chat_req.message, chat_history=chat.messages)
    
    # 3. Save AI response
    ai_msg = Message(chat_id=chat.id, role="assistant", content=ai_response_text)
    db.add(ai_msg)
    
    await db.commit()
    await db.refresh(ai_msg)
    
    return StandardMessageResponse(data=ai_msg)
