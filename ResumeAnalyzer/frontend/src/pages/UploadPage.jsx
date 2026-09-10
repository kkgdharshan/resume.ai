import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File, X, Loader2 } from 'lucide-react';
import { analyzeResume } from '../services/api';

export default function UploadPage({ setResumeData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeResume(file);
      setResumeData({
        resumeId: result.resume_id,
        analysis: result.analysis
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Upload Your Resume</h1>
        <p className="text-slate-600">Supported formats: PDF, DOCX (Max 5MB)</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700">Drag & Drop your resume here</p>
            <p className="text-sm text-slate-500 mt-2">or click to Browse Files</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl p-6 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-4">
              <File className="w-10 h-10 text-indigo-500" />
              <div>
                <p className="font-medium text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 hover:bg-slate-200 rounded-full transition"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition ${!file || loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Analyze Resume</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
