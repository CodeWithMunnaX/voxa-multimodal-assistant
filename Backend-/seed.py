import psycopg2
import os
from datetime import datetime
import bcrypt

DATABASE_URL = "postgresql://neondb_owner:npg_tbkhAG63XQas@ep-little-sky-av1izxhu-pooler.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require"

def add_user():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        email = "s6899878@gmail.com"
        password = "Simran@#$2007"
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        now = datetime.utcnow()
        
        # Check if exists
        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        
        if user:
            print(f"User {email} exists. Updating password.")
            cur.execute("UPDATE users SET hashed_password = %s WHERE email = %s", (hashed, email))
        else:
            print(f"Adding user {email}.")
            cur.execute("""
                INSERT INTO users (email, name, hashed_password, role, is_active, is_verified, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (email, "Simran", hashed, "admin", True, True, now, now))
            
        conn.commit()
        cur.close()
        conn.close()
        print("Success!")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    add_user()
