import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { compareJob } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function DashboardPage({ resumeData }) {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatch, setJobMatch] = useState(null);
  const [comparing, setComparing] = useState(false);

  if (!resumeData) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">No resume data found</h2>
        <button onClick={() => navigate('/upload')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
          Upload Resume
        </button>
      </div>
    );
  }

  const { analysis, resumeId } = resumeData;

  const handleCompare = async () => {
    if (!jobDescription) return;
    setComparing(true);
    try {
      const match = await compareJob(resumeId, jobDescription);
      setJobMatch(match);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Analysis Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/upload')} className="text-indigo-600 hover:underline font-medium">
            Upload Another
          </button>
        </div>
      </div>

      <p className="text-slate-600 text-lg">{analysis.summary}</p>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center space-x-8">
          <div className="w-32 h-32">
            <CircularProgressbar 
              value={analysis.overall_score} 
              text={`${analysis.overall_score}`} 
              styles={buildStyles({
                pathColor: analysis.overall_score >= 80 ? '#22c55e' : analysis.overall_score >= 60 ? '#f59e0b' : '#ef4444',
                textColor: '#0f172a',
                trailColor: '#f1f5f9',
              })}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Overall Score</h2>
            <p className="text-slate-500 mt-2">Based on content, impact, and structure.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center space-x-8">
          <div className="w-32 h-32">
            <CircularProgressbar 
              value={analysis.ats_score} 
              text={`${analysis.ats_score}`} 
              styles={buildStyles({
                pathColor: analysis.ats_score >= 80 ? '#3b82f6' : analysis.ats_score >= 60 ? '#f59e0b' : '#ef4444',
                textColor: '#0f172a',
                trailColor: '#f1f5f9',
              })}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">ATS Score</h2>
            <p className="text-slate-500 mt-2">How well robots can read your resume.</p>
          </div>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center text-green-600">
            <span className="mr-2">✓</span> Resume Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((item, i) => (
              <li key={i} className="text-slate-700 bg-green-50 px-4 py-2 rounded-lg">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center text-red-600">
            <span className="mr-2">✗</span> Resume Weaknesses
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((item, i) => (
              <li key={i} className="text-slate-700 bg-red-50 px-4 py-2 rounded-lg">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Detected Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Missing / Recommended Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Improvement Suggestions</h3>
        <ul className="space-y-4">
          {analysis.recommendations.map((item, i) => (
            <li key={i} className="flex space-x-3 text-slate-700">
              <span className="text-indigo-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Job Matching */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Job Description Match</h3>
        <p className="text-slate-500 mb-6">Paste a job description below to see how well your resume matches.</p>
        
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none mb-4"
        />
        
        <button
          onClick={handleCompare}
          disabled={!jobDescription || comparing}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center space-x-2"
        >
          {comparing && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Compare Resume</span>
        </button>

        {jobMatch && (
          <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20">
                  <CircularProgressbar 
                    value={jobMatch.match_score} 
                    text={`${jobMatch.match_score}%`} 
                    styles={buildStyles({ pathColor: '#6366f1', textColor: '#0f172a' })}
                  />
                </div>
                <h4 className="text-xl font-bold">Job Match Score</h4>
              </div>
              
              <h5 className="font-semibold mb-2">Matching Skills</h5>
              <div className="flex flex-wrap gap-2 mb-4">
                {jobMatch.matching_skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md">✓ {s}</span>
                ))}
              </div>
              
              <h5 className="font-semibold mb-2">Missing Skills</h5>
              <div className="flex flex-wrap gap-2">
                {jobMatch.missing_skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-red-50 text-red-700 text-sm rounded-md">✗ {s}</span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold mb-3">Recommendations</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                {jobMatch.recommendations.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
