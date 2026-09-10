import { Link } from 'react-router-dom';
import { FileText, CheckCircle, BarChart, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-16">
      
      {/* Hero Section */}
      <section className="text-center mt-12 w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Build a Resume That <span className="text-indigo-600">Gets Noticed</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10">
          Upload your resume and get AI-powered feedback, a personalized score, missing-skill detection, and actionable suggestions.
        </p>
        <div className="flex justify-center space-x-6">
          <Link to="/upload" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition">
            Analyze My Resume
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mt-12">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="bg-indigo-50 p-4 rounded-full mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Resume Analysis</h3>
            <p className="text-slate-600 text-sm">Deep scan of your resume content against industry standards.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="bg-green-50 p-4 rounded-full mb-4">
              <BarChart className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Resume Score</h3>
            <p className="text-slate-600 text-sm">Get an objective score and ATS compatibility rating.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Gap Detection</h3>
            <p className="text-slate-600 text-sm">Identify missing keywords and skills for your target roles.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Resume Assistant</h3>
            <p className="text-slate-600 text-sm">Chat with our AI to rewrite sections and get specific advice.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full max-w-4xl mt-12 bg-white rounded-3xl shadow-sm border border-slate-100 p-10">
        <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-black text-indigo-200 mb-2">01</div>
            <h4 className="font-semibold">Upload Resume</h4>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-200 mb-2">02</div>
            <h4 className="font-semibold">AI Analyzes Your Resume</h4>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-200 mb-2">03</div>
            <h4 className="font-semibold">Get Personalized Recommendations</h4>
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-200 mb-2">04</div>
            <h4 className="font-semibold">Improve Your Resume</h4>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-12 mb-20">
        <h2 className="text-3xl font-bold mb-6">Ready to improve your resume?</h2>
        <Link to="/upload" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition">
          Analyze My Resume
        </Link>
      </section>
    </div>
  );
}
