"""Seed a demo account with realistic sample data.

Usage (from the Backend- folder, with DATABASE_URL in .env or the environment):
    python seed.py                                  # demo@codewithmunnax.com / Demo@1234
    python seed.py --email you@example.com --password "secret123" --name "Your Name"

Re-running is safe: the demo user's existing data is deleted and recreated.
"""
import argparse
import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import delete, select

from app.core.database import engine, AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.base import Base
from app.models import (
    User, Chat, Message, Folder, Note, Document, Notification, Setting,
    VoiceSession, AITutorSession, Analytics,
)

NOW = datetime.now(timezone.utc)


def ago(days: float = 0, hours: float = 0, minutes: float = 0) -> datetime:
    return NOW - timedelta(days=days, hours=hours, minutes=minutes)


FOLDERS = ["Machine Learning", "Web Development", "Interview Prep"]

# (folder, title, days_ago, [(user, assistant), ...])
CHATS = [
    ("Machine Learning", "Overfitting vs underfitting", 0.1, [
        ("What is the difference between overfitting and underfitting?",
         "**Overfitting** happens when a model learns the training data *too* well, including its noise, so it scores "
         "high on training data but poorly on new data.\n\n**Underfitting** is the opposite: the model is too simple to "
         "capture the underlying pattern and performs poorly on both.\n\n| | Training error | Test error |\n|---|---|---|\n"
         "| Underfitting | High | High |\n| Good fit | Low | Low |\n| Overfitting | Very low | High |"),
        ("How do I reduce overfitting?",
         "Common fixes:\n\n1. **More data** or data augmentation\n2. **Regularization** – L1/L2 penalties, dropout\n"
         "3. **Simpler model** – fewer layers/parameters, shallower trees\n4. **Early stopping** on validation loss\n"
         "5. **Cross-validation** to tune hyperparameters honestly"),
    ]),
    ("Machine Learning", "Gradient descent explained", 1.2, [
        ("Explain gradient descent simply.",
         "Imagine standing on a hill in fog and wanting to reach the valley. You feel the slope under your feet and take "
         "a small step downhill, then repeat.\n\nIn ML, the *hill* is the loss function and the *slope* is its gradient:\n\n"
         "```\nθ = θ - α · ∇L(θ)\n```\n\n`α` (learning rate) controls step size – too big and you overshoot, too small and "
         "training is slow."),
        ("What's the difference between batch, mini-batch and stochastic?",
         "- **Batch GD**: uses the whole dataset per step – stable but slow.\n- **Stochastic GD**: one sample per step – "
         "fast and noisy.\n- **Mini-batch GD**: 32–512 samples per step – the practical default, it balances speed and "
         "stability and uses GPUs well."),
    ]),
    ("Machine Learning", "CNN for image classification", 2.4, [
        ("Why do CNNs work better than dense networks for images?",
         "Three ideas make CNNs efficient for images:\n\n1. **Local receptive fields** – each filter looks at a small "
         "patch, matching how edges and textures are local.\n2. **Weight sharing** – the same filter slides across the "
         "image, so far fewer parameters.\n3. **Pooling** – builds some translation invariance.\n\nA 224×224×3 image into a "
         "dense layer of 1,000 units needs ~150M weights; a 3×3 conv with 64 filters needs ~1.7K."),
    ]),
    ("Machine Learning", "Pandas groupby cheatsheet", 3.1, [
        ("How do I get the average salary per department in pandas?",
         "```python\ndf.groupby(\"department\")[\"salary\"].mean().sort_values(ascending=False)\n```\n\nMultiple "
         "aggregations at once:\n\n```python\ndf.groupby(\"department\").agg(\n    avg_salary=(\"salary\", \"mean\"),\n"
         "    headcount=(\"employee_id\", \"count\"),\n    max_salary=(\"salary\", \"max\"),\n)\n```"),
        ("And how do I filter groups with more than 5 employees?",
         "Use `filter` on the groupby:\n\n```python\ndf.groupby(\"department\").filter(lambda g: len(g) > 5)\n```\n\n"
         "This returns the original rows, but only for departments with more than 5 employees."),
    ]),
    ("Web Development", "React useEffect pitfalls", 4.0, [
        ("Why does my useEffect run twice?",
         "In development, **React Strict Mode** mounts components twice on purpose to surface side-effect bugs. It "
         "doesn't happen in production.\n\nMake the effect safe to re-run by returning a cleanup:\n\n```jsx\nuseEffect(() => {\n"
         "  const controller = new AbortController();\n  fetch(url, { signal: controller.signal });\n"
         "  return () => controller.abort();\n}, [url]);\n```"),
    ]),
    ("Web Development", "REST vs GraphQL", 5.2, [
        ("Should I use REST or GraphQL for my project?",
         "**Choose REST** if your API is resource-oriented, you want simple HTTP caching, or the team is small.\n\n"
         "**Choose GraphQL** if many clients need different shapes of the same data, you want to avoid over-fetching on "
         "mobile, or you're aggregating several services.\n\nFor a typical CRUD app with one frontend, REST with good "
         "endpoint design is usually simpler to build and operate."),
    ]),
    ("Interview Prep", "SQL joins practice", 5.9, [
        ("Explain INNER, LEFT and FULL OUTER join with an example.",
         "Tables: `students(id, name)` and `marks(student_id, score)`.\n\n- **INNER JOIN** – only students who have "
         "marks.\n- **LEFT JOIN** – all students; `score` is NULL if they have no marks.\n- **FULL OUTER JOIN** – everyone "
         "from both sides, NULLs where there's no match.\n\n```sql\nSELECT s.name, m.score\nFROM students s\n"
         "LEFT JOIN marks m ON m.student_id = s.id;\n```"),
        ("How do I find the second highest score?",
         "```sql\nSELECT MAX(score) AS second_highest\nFROM marks\nWHERE score < (SELECT MAX(score) FROM marks);\n```\n\n"
         "Or with a window function, which also handles ties and the N-th highest:\n\n```sql\nSELECT score FROM (\n"
         "  SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) AS rnk FROM marks\n) t WHERE rnk = 2;\n```"),
    ]),
    ("Interview Prep", "Tell me about yourself", 6.5, [
        ("Help me answer 'Tell me about yourself' for a data science internship.",
         "Use a **Present → Past → Future** structure in about 60 seconds:\n\n1. **Present** – \"I'm a final-year student "
         "focusing on machine learning and data analysis.\"\n2. **Past** – one or two projects with impact, e.g. \"I built "
         "an ANPR system using YOLOv8 and OpenCV that reads number plates with ~95% confidence.\"\n3. **Future** – why "
         "this role: \"I want to apply ML to real business problems, which is why this internship excites me.\""),
    ]),
]

NOTES = [
    ("Bias–variance tradeoff",
     "## Bias–variance tradeoff\n\n- **High bias** → underfitting (model too simple)\n- **High variance** → overfitting "
     "(model too sensitive to training data)\n- Goal: minimize *total* error = bias² + variance + irreducible noise\n\n"
     "Tools: regularization, cross-validation, ensembling (bagging lowers variance, boosting lowers bias)."),
    ("Evaluation metrics",
     "## Classification metrics\n\n| Metric | When to use |\n|---|---|\n| Accuracy | Balanced classes |\n"
     "| Precision | False positives are costly (spam filter) |\n| Recall | False negatives are costly (disease detection) |\n"
     "| F1 | Need a balance on imbalanced data |\n| ROC-AUC | Ranking quality across thresholds |"),
    ("Python one-liners",
     "```python\n# Flatten a list of lists\nflat = [x for row in grid for x in row]\n\n# Count items\nfrom collections import Counter\n"
     "Counter(words).most_common(5)\n\n# Merge dicts\nmerged = {**a, **b}\n```"),
    ("Week plan",
     "- [x] Finish CNN assignment\n- [x] Revise SQL window functions\n- [ ] Mock interview on Friday\n- [ ] Deploy portfolio "
     "projects\n- [ ] Read *Attention Is All You Need*"),
    ("System design basics",
     "## Scaling a web app\n\n1. Vertical scaling first, then horizontal behind a **load balancer**\n2. Add a **cache** "
     "(Redis) for hot reads\n3. **Read replicas** for the database\n4. Move slow work to a **queue** (background jobs)\n"
     "5. Serve static assets from a **CDN**"),
    ("Transformer notes",
     "## Self-attention\n\nEach token creates Query, Key and Value vectors.\n\n`Attention(Q,K,V) = softmax(QKᵀ / √d) · V`\n\n"
     "- Multi-head attention lets the model focus on different relationships at once\n- Positional encodings add word order"),
]

DOCUMENTS = [
    ("Attention Is All You Need.pdf", "https://arxiv.org/pdf/1706.03762", "pdf", 2_215_244,
     "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks... "
     "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms."),
    ("Deep Residual Learning (ResNet).pdf", "https://arxiv.org/pdf/1512.03385", "pdf", 812_034,
     "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the "
     "training of networks that are substantially deeper than those used previously."),
    ("Batch Normalization.pdf", "https://arxiv.org/pdf/1502.03167", "pdf", 412_771,
     "Training Deep Neural Networks is complicated by the fact that the distribution of each layer's inputs changes "
     "during training... We refer to this phenomenon as internal covariate shift."),
]

NOTIFICATIONS = [
    ("Welcome to Voxa AI 👋", "Your workspace is ready. Try asking the AI tutor a question!", True, 6.8),
    ("Document processed", "\"Attention Is All You Need.pdf\" is ready for questions.", True, 3.0),
    ("Weekly summary", "You asked 14 questions this week across 8 chats. Keep it up!", False, 1.0),
    ("New feature: Presentations", "Turn any topic into slides in one click.", False, 0.5),
    ("Study reminder", "Your mock interview prep is scheduled for Friday.", False, 0.1),
]

TUTOR_TOPICS = [("Linear Regression", 5.0), ("Neural Networks", 2.5), ("SQL Window Functions", 0.8)]
VOICE_SESSIONS = [(185, 6.0), (320, 3.5), (95, 1.5), (240, 0.3)]


async def seed(email: str, password: str, name: str) -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        existing = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if existing:
            # Delete children explicitly (some tables have no ORM cascade from User)
            for model in (Analytics, VoiceSession, AITutorSession):
                await db.execute(delete(model).where(model.user_id == existing.id))
            await db.delete(existing)
            await db.commit()
            print(f"Removed previous data for {email}")

        user = User(email=email, name=name, hashed_password=get_password_hash(password),
                    role="user", is_active=True, is_verified=True, created_at=ago(days=7))
        db.add(user)
        await db.flush()

        db.add(Setting(user_id=user.id, theme="Light", language="English", ai_response_style="Professional"))

        folders = {}
        for folder_name in FOLDERS:
            folder = Folder(user_id=user.id, name=folder_name, created_at=ago(days=7))
            db.add(folder)
            folders[folder_name] = folder
        await db.flush()

        message_count = 0
        for folder_name, title, days, turns in CHATS:
            start = ago(days=days)
            chat = Chat(user_id=user.id, title=title, folder_id=folders[folder_name].id,
                        created_at=start, updated_at=start + timedelta(minutes=10 * len(turns)))
            db.add(chat)
            await db.flush()
            for i, (question, answer) in enumerate(turns):
                t = start + timedelta(minutes=10 * i)
                db.add(Message(chat_id=chat.id, role="user", content=question, created_at=t))
                db.add(Message(chat_id=chat.id, role="assistant", content=answer, created_at=t + timedelta(seconds=8)))
                message_count += 2

        for i, (title, content) in enumerate(NOTES):
            db.add(Note(user_id=user.id, title=title, content=content, created_at=ago(days=6 - i)))

        for i, (filename, url, file_type, size, text) in enumerate(DOCUMENTS):
            db.add(Document(user_id=user.id, filename=filename, cloudinary_url=url, cloudinary_public_id="",
                            file_type=file_type, file_size=size, extracted_text=text, created_at=ago(days=4 - i)))

        for title, message, is_read, days in NOTIFICATIONS:
            db.add(Notification(user_id=user.id, title=title, message=message, is_read=is_read, created_at=ago(days=days)))

        for topic, days in TUTOR_TOPICS:
            db.add(AITutorSession(user_id=user.id, topic=topic, context=f"Guided lesson on {topic}", created_at=ago(days=days)))

        for seconds, days in VOICE_SESSIONS:
            db.add(VoiceSession(user_id=user.id, duration_seconds=seconds, created_at=ago(days=days)))

        for action, days in [("login", 6.9), ("upload_document", 4.0), ("create_presentation", 2.0), ("login", 0.2)]:
            db.add(Analytics(user_id=user.id, action=action, created_at=ago(days=days)))

        await db.commit()

    print(f"Seeded {email}: {len(FOLDERS)} folders, {len(CHATS)} chats ({message_count} messages), "
          f"{len(NOTES)} notes, {len(DOCUMENTS)} documents, {len(NOTIFICATIONS)} notifications, "
          f"{len(TUTOR_TOPICS)} tutor sessions, {len(VOICE_SESSIONS)} voice sessions")
    await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed a Voxa AI demo account")
    parser.add_argument("--email", default="demo@codewithmunnax.com")
    parser.add_argument("--password", default="Demo@1234")
    parser.add_argument("--name", default="Demo User")
    args = parser.parse_args()
    asyncio.run(seed(args.email.strip().lower(), args.password, args.name))
