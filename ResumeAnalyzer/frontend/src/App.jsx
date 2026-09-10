import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import IntegratedChat from './components/IntegratedChat';

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <Router>
      <div className="h-screen flex flex-col overflow-hidden">
        <nav className="bg-white border-b border-slate-200 flex-shrink-0 z-10 relative">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-14">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-indigo-600">ResumAI</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/upload" className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Upload</Link>
                {resumeData && (
                  <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 text-sm font-medium">Dashboard</Link>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex overflow-hidden bg-slate-50 relative">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/upload" element={<UploadPage setResumeData={setResumeData} />} />
                <Route path="/dashboard" element={<DashboardPage resumeData={resumeData} />} />
                <Route path="/chat" element={<ChatbotPage resumeData={resumeData} />} />
              </Routes>
            </div>
          </main>

          {/* Integrated Side Panel */}
          <IntegratedChat resumeData={resumeData} />
        </div>
      </div>
    </Router>
  );
}

export default App;
