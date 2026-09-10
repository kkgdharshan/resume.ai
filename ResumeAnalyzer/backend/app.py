import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from utils.parser import extract_text_from_file
from utils.ai import analyze_resume, compare_job, chat_with_assistant
from database.db import init_db, save_resume, get_resume, save_chat_message, get_chat_history

load_dotenv()

app = Flask(__name__)
CORS(app) # Allow CORS for frontend

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024 # 5 MB limit

ALLOWED_EXTENSIONS = {'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Initialize database
init_db()

@app.route('/api/analyze', methods=['POST'])
def analyze_api():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request.'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading.'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # 1. Extract Text
            text = extract_text_from_file(filepath)
            if not text or len(text) < 50:
                return jsonify({'error': 'We couldn\'t extract readable text from this resume, or it is too short.'}), 400
                
            # 2. Analyze with OpenAI
            analysis_result = analyze_resume(text)
            if not analysis_result:
                return jsonify({'error': 'AI analysis failed. Please try again.'}), 500
                
            # 3. Save to Database
            resume_id = save_resume(filename, text, analysis_result)
            
            # 4. Cleanup uploaded file to save space (optional, keeping for now)
            # os.remove(filepath)
            
            return jsonify({
                'message': 'Analysis successful',
                'resume_id': resume_id,
                'analysis': analysis_result
            }), 200
            
        except Exception as e:
            print(f"Error processing file: {e}")
            return jsonify({'error': 'An internal error occurred during processing.'}), 500
    else:
        return jsonify({'error': 'Only PDF and DOCX files are supported.'}), 400

@app.route('/api/compare', methods=['POST'])
def compare_api():
    data = request.json
    resume_id = data.get('resume_id')
    job_description = data.get('job_description')
    
    if not resume_id or not job_description:
        return jsonify({'error': 'Missing resume_id or job_description.'}), 400
        
    resume = get_resume(resume_id)
    if not resume:
        return jsonify({'error': 'Resume not found.'}), 404
        
    comparison_result = compare_job(resume['text_content'], job_description)
    if not comparison_result:
        return jsonify({'error': 'AI comparison failed.'}), 500
        
    return jsonify(comparison_result), 200

@app.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.json
    resume_id = data.get('resume_id')
    message = data.get('message')
    
    if not message:
        return jsonify({'error': 'Missing message.'}), 400
        
    history = []
    resume_text = None
    
    if resume_id:
        resume = get_resume(resume_id)
        if resume:
            resume_text = resume['text_content']
            history = get_chat_history(resume_id)
    
    # Get response
    response_text = chat_with_assistant(resume_text, message, history)
    
    # Save messages
    if resume_id:
        save_chat_message(resume_id, 'user', message)
        save_chat_message(resume_id, 'assistant', response_text)
    
    return jsonify({'response': response_text}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
