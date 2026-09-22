import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { AuthModal } from './pages/AuthModal';
import { TrackSelection } from './pages/TrackSelection';
import { SkillAssessment } from './pages/SkillAssessment';
import { SkillGapReportView } from './pages/SkillGapReportView';
import { LearningPathView } from './pages/LearningPathView';
import { QuizGeneratorView } from './pages/QuizGeneratorView';
import { LearnerDashboardView } from './pages/LearnerDashboardView';
import { AdminDashboardView } from './pages/AdminDashboardView';
import { CoursesCatalogueView } from './pages/CoursesCatalogueView';
import { SkillTrack, SkillGapReport } from './types';
import { DEFAULT_TRACKS } from './data/tracks';

const MainApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<SkillTrack>(DEFAULT_TRACKS[0]);
  const [latestGapReport, setLatestGapReport] = useState<SkillGapReport | null>(null);

  const handleStartAssessment = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setCurrentView('track-selection');
  };

  const handleTrackSelected = (track: SkillTrack) => {
    setSelectedTrack(track);
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = (report: SkillGapReport) => {
    setLatestGapReport(report);
    setCurrentView('gap-report');
  };

  return (
    <div className="min-h-screen bg-[#e9e9ea] text-slate-900 flex flex-col justify-between">
      {/* If not in landing hero, show fixed/top sticky navbar */}
      {currentView !== 'landing' && (
        <header className="max-w-6xl mx-auto w-full pt-4 px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80">
            <Navbar
              onOpenAuth={() => setIsAuthOpen(true)}
              onNavigate={(v) => setCurrentView(v)}
              currentView={currentView}
            />
          </div>
        </header>
      )}

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'landing' && (
          <div>
            <LandingHero
              onOpenAuth={() => setIsAuthOpen(true)}
              onStartAssessment={handleStartAssessment}
              onNavigate={(v) => setCurrentView(v)}
              currentView={currentView}
            />
            <div id="features">
              <FeaturesSection onStartAssessment={handleStartAssessment} />
            </div>
          </div>
        )}

        {currentView === 'features' && (
          <div className="py-8">
            <FeaturesSection onStartAssessment={handleStartAssessment} />
          </div>
        )}

        {currentView === 'track-selection' && (
          <TrackSelection onTrackSelected={handleTrackSelected} />
        )}

        {currentView === 'assessment' && (
          <SkillAssessment
            track={selectedTrack}
            onAssessmentComplete={handleAssessmentComplete}
          />
        )}

        {currentView === 'gap-report' && latestGapReport && (
          <SkillGapReportView
            report={latestGapReport}
            onProceedToPath={() => setCurrentView('path')}
          />
        )}

        {currentView === 'path' && (
          <LearningPathView
            onNavigateToQuiz={() => setCurrentView('quiz-gen')}
          />
        )}

        {currentView === 'quiz-gen' && (
          <QuizGeneratorView />
        )}

        {currentView === 'courses' && (
          <CoursesCatalogueView />
        )}

        {currentView === 'dashboard' && (
          <LearnerDashboardView
            onNavigateToQuiz={() => setCurrentView('quiz-gen')}
            onNavigateToPath={() => setCurrentView('path')}
            onNavigateToAssessment={() => setCurrentView('track-selection')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminDashboardView />
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          if (currentView === 'landing') {
            setCurrentView('dashboard');
          }
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
