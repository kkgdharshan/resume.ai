import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini client
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Failed to initialize Gemini client: {e}")

def analyze_resume(resume_text):
    """
    Analyzes the resume text and returns a structured JSON response using Gemini.
    """
    if not client: return None
    
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) and senior technical recruiter. 
    Analyze the following resume and provide structured feedback in JSON format.
    
    Resume Text:
    {resume_text}
    
    Return a JSON object with EXACTLY the following structure:
    {{
        "overall_score": <number 0-100>,
        "ats_score": <number 0-100>,
        "summary": "<a 2-3 sentence summary of the candidate's profile>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
        "skills": ["<skill 1>", "<skill 2>"],
        "missing_skills": ["<missing skill 1>", "<missing skill 2>"],
        "sections": {{
            "summary": {{
                "score": <number 0-10>,
                "strengths": ["..."],
                "problems": ["..."],
                "suggestions": ["..."]
            }},
            "education": {{
                "score": <number 0-10>,
                "strengths": ["..."],
                "problems": ["..."],
                "suggestions": ["..."]
            }},
            "skills": {{
                "score": <number 0-10>,
                "strengths": ["..."],
                "problems": ["..."],
                "suggestions": ["..."]
            }},
            "projects": {{
                "score": <number 0-10>,
                "strengths": ["..."],
                "problems": ["..."],
                "suggestions": ["..."]
            }},
            "experience": {{
                "score": <number 0-10>,
                "strengths": ["..."],
                "problems": ["..."],
                "suggestions": ["..."]
            }}
        }},
        "recommendations": ["<recommendation 1>", "<recommendation 2>"]
    }}
    """
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error in Gemini analysis: {e}")
        return None

def compare_job(resume_text, job_description):
    """
    Compares resume with a job description.
    """
    if not client: return None
    
    prompt = f"""
    You are an expert technical recruiter. Compare the following resume with the job description.
    
    Job Description:
    {job_description}
    
    Resume:
    {resume_text}
    
    Return a JSON object with EXACTLY the following structure:
    {{
        "match_score": <number 0-100>,
        "matching_skills": ["<skill 1>", "<skill 2>"],
        "missing_skills": ["<skill 1>", "<skill 2>"],
        "keyword_analysis": [
            {{"keyword": "<keyword>", "found": true/false}}
        ],
        "recommendations": ["<recommendation 1>", "<recommendation 2>"]
    }}
    """
    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error in Gemini job comparison: {e}")
        return None

def chat_with_assistant(resume_text, message, chat_history=[]):
    """
    Chat with the AI assistant. If resume_text is provided, use it as context.
    """
    if not client: return "I am currently unavailable due to missing API keys."
    
    if resume_text:
        system_instruction = f"You are a helpful, expert career counselor and resume assistant. The user has uploaded their resume. Your goal is to help them improve it, answer their questions, and provide specific, actionable advice based ONLY on the context of their resume when relevant. Do NOT give generic advice if you can refer to their actual resume.\n\nHere is the extracted text of their resume:\n\n{resume_text}"
    else:
        system_instruction = "You are a helpful, expert career counselor and resume assistant. The user has NOT uploaded their resume yet. Answer their general questions about resumes, career advice, and how to build a good resume."

    formatted_history = []
    for msg in chat_history:
        role = 'model' if msg['role'] == 'assistant' else 'user'
        formatted_history.append(
            types.Content(role=role, parts=[types.Part.from_text(text=msg['content'])])
        )
        
    try:
        chat = client.chats.create(
            model="gemini-3.6-flash",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7,
            ),
            history=formatted_history
        )
        
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        print(f"Error in Gemini chat: {e}")
        return "Sorry, I encountered an error while trying to respond."
