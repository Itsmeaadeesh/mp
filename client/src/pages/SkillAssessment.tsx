import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillTrack, QuizQuestion, SkillGapReport } from '../types';
import { CheckCircle2, HelpCircle, Sliders, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SkillAssessmentProps {
  track: SkillTrack;
  onAssessmentComplete: (gapReport: SkillGapReport) => void;
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({ track, onAssessmentComplete }) => {
  const { user, refreshProfile } = useAuth();
  const [mode, setMode] = useState<'self_rate' | 'quiz'>('quiz');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const res = await api.startAssessment(track.id, mode);
        if (mode === 'quiz' && res.questions) {
          setQuestions(res.questions);
        }
        // Initialize self-ratings to 2 by default
        const initialRatings: Record<string, number> = {};
        track.skills.forEach(s => {
          initialRatings[s.id] = user?.skillLevels?.[s.id] || 2;
        });
        setRatings(initialRatings);
      } catch (err) {
        console.error('Failed to load assessment:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [track.id, mode]);

  const handleRatingChange = (skillId: string, val: number) => {
    setRatings(prev => ({ ...prev, [skillId]: val }));
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const payload: any = {
        userId: user.uid,
        trackId: track.id,
        mode
      };

      if (mode === 'self_rate') {
        payload.ratings = ratings;
      } else {
        payload.quizAnswers = quizAnswers;
      }

      const res = await api.submitAssessment(payload);
      await refreshProfile();

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onAssessmentComplete(res.gapReport);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const getProficiencyLabel = (val: number) => {
    switch (val) {
      case 1: return { text: 'Novice (No practical experience)', color: 'text-slate-500' };
      case 2: return { text: 'Beginner (Basic understanding)', color: 'text-blue-500' };
      case 3: return { text: 'Competent (Build independently)', color: 'text-indigo-600' };
      case 4: return { text: 'Proficient (Production ready)', color: 'text-emerald-600' };
      case 5: return { text: 'Expert / Architect', color: 'text-purple-600' };
      default: return { text: 'Unspecified', color: 'text-slate-400' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Step 2: Baseline Assessment
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Diagnose Your {track.trackName} Foundation
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Establish your baseline so we can pinpoint exact missing competencies.
        </p>

        {/* Mode Switcher */}
        <div className="mt-6 inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200">
          <button
            onClick={() => setMode('quiz')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              mode === 'quiz'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive Diagnostic Quiz</span>
          </button>
          <button
            onClick={() => setMode('self_rate')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-2 ${
              mode === 'self_rate'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Self-Rate Proficiency</span>
          </button>
        </div>
      </div>

      {/* Mode A: Interactive Quiz */}
      {mode === 'quiz' && questions.length > 0 && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">
              Question {currentQuizIndex + 1} of {questions.length}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold uppercase tracking-wider text-[10px]">
              {questions[currentQuizIndex].difficulty || 'intermediate'}
            </span>
          </div>

          {/* Active Question */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 leading-snug mb-6">
              {questions[currentQuizIndex].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQuizIndex].options.map((option, optIdx) => {
                const isSelected = quizAnswers[questions[currentQuizIndex].id] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectAnswer(questions[currentQuizIndex].id, optIdx)}
                    className={`p-4 rounded-2xl border text-sm font-medium cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-900 shadow-sm ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz Stepper & Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={() => setCurrentQuizIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuizIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30"
            >
              Previous
            </button>

            {currentQuizIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuizIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(quizAnswers).length < questions.length}
                className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 transition-all flex items-center space-x-2"
              >
                <span>{submitting ? 'Analyzing Responses...' : 'Finish & View Gaps'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode B: Self-Rate Proficiency */}
      {mode === 'self_rate' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="mb-6 pb-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Self-Rate Your Competencies</h3>
            <p className="text-xs text-slate-500 mt-1">
              Be honest with your self-ratings. The AI recommendation engine uses this to prevent recommending beginner material if you are already advanced.
            </p>
          </div>

          <div className="space-y-6">
            {track.skills.map(skill => {
              const currentRating = ratings[skill.id] || 1;
              const { text: labelText, color: labelColor } = getProficiencyLabel(currentRating);

              return (
                <div key={skill.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-800">{skill.name}</span>
                      <span className="text-[10px] text-slate-400 block">{skill.description}</span>
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <span className={`text-xs font-bold ${labelColor}`}>
                        Level {currentRating} / 5
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">{labelText}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={currentRating}
                      onChange={(e) => handleRatingChange(skill.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Computing Skill Gaps...' : 'Submit & Analyze Gaps'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
