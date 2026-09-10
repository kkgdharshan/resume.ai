import os
import PyPDF2
from docx import Document

def extract_text_from_file(filepath):
    """
    Extracts text from a PDF or DOCX file.
    """
    ext = os.path.splitext(filepath)[1].lower()
    text = ""
    
    try:
        if ext == '.pdf':
            with open(filepath, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        elif ext == '.docx':
            doc = Document(filepath)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            raise ValueError(f"Unsupported file extension: {ext}")
            
        return text.strip()
    except Exception as e:
        print(f"Error extracting text: {e}")
        return None
