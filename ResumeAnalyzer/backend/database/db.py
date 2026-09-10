import sqlite3
import os
import json

DB_FILE = os.path.join(os.path.dirname(__file__), '..', 'resume_analyzer.db')

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            text_content TEXT,
            analysis_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_id INTEGER,
            role TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(resume_id) REFERENCES resumes(id)
        )
    ''')
    conn.commit()
    conn.close()

def save_resume(filename, text_content, analysis_json):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        'INSERT INTO resumes (filename, text_content, analysis_json) VALUES (?, ?, ?)',
        (filename, text_content, json.dumps(analysis_json))
    )
    resume_id = c.lastrowid
    conn.commit()
    conn.close()
    return resume_id

def get_resume(resume_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM resumes WHERE id = ?', (resume_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def save_chat_message(resume_id, role, content):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        'INSERT INTO chats (resume_id, role, content) VALUES (?, ?, ?)',
        (resume_id, role, content)
    )
    conn.commit()
    conn.close()

def get_chat_history(resume_id):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT role, content FROM chats WHERE resume_id = ? ORDER BY id ASC', (resume_id,))
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]
