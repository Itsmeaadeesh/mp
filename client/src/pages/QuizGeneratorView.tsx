import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { QuizQuestion, QuizAttempt } from '../types';
import { UploadCloud, FileText, Sparkles, CheckCircle2, XCircle, ArrowRight, RefreshCw, Award, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizGeneratorView: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [topic, setTopic] = useState('React Hooks & Architecture');
  const [questionCount, setQuestionCount] = useState(5);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAttemptResult(null);
    setUserAnswers({});

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('topic', topic);
        formData.append('questionCount', questionCount.toString());
        res = await api.generateQuiz(formData);
      } else {
        res = await api.generateQuiz({
          text: pastedText || `Subject: ${topic}. Architectural best practices and modern implementation guidelines.`,
          topic,
          questionCount
        });
      }

      setQuestions(res.questions);
      setActiveQuizId(res.quizId);
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizId || !user) return;
    setSubmitting(true);
    try {
      const res = await api.submitQuiz(activeQuizId, {
        userId: user.uid,
        answers: userAnswers,
        quizTitle: `${topic} AI Assessment`
      });

      setAttemptResult(res.attempt);
      await refreshProfile();

      if (res.attempt.percentage >= 60) {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Module 5 & 6: AI Assessment Engine
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Generate AI Quizzes from Course Docs
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Upload any lecture PDF, PPT notes, or syllabus. Gemini synthesizes concepts into instant evaluative MCQs.
        </p>
      </div>

      {/* Generator Form */}
      {!activeQuizId && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider">
                Upload Document (PDF, PPT, TXT)
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-3xl p-8 text-center transition-colors cursor-pointer relative bg-slate-50/50">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6" />
                </div>
                {file ? (
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">{file.name}</span>
                    <span className="text-xs text-slate-400 mt-1 block">{(file.size / 1024).toFixed(1)} KB • Ready to extract</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-slate-700 block">Click to upload or drag & drop</span>
                    <span className="text-xs text-slate-400 mt-1 block">Supports PDF, PPT, and text documents up to 20MB</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                  Target Topic / Skill Tag
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. React Architecture, SQL Indexing..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                  Question Count: {questionCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-3"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                Or Paste Material / Notes Directly
              </label>
              <textarea
                rows={3}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste key notes, summary, or syllabus text here..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Gemini Extracting & Generating...' : 'Generate Quiz Questions'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Taking Quiz Section */}
      {activeQuizId && !attemptResult && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{topic}</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Generated Assessment</h3>
            </div>
            <button
              onClick={() => { setActiveQuizId(null); setQuestions([]); }}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Reset
            </button>
          </div>

          <div className="space-y-8">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100">
                <span className="text-xs font-bold text-slate-400 mb-2 block">Question {qIdx + 1}</span>
                <p className="text-base font-bold text-slate-900 mb-4">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className={`p-3.5 rounded-xl border text-sm font-medium cursor-pointer transition-all flex items-center space-x-3 ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || Object.keys(userAnswers).length < questions.length}
              className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-40 transition-all flex items-center space-x-2"
            >
              <span>{submitting ? 'Evaluating Submission...' : 'Submit & Review Answers'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Results & Per-Question Detailed Explanations */}
      {attemptResult && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft animate-fade-in">
          {/* Score Header */}
          <div className="text-center pb-8 border-b border-slate-100">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-50 border-4 border-blue-600 flex items-center justify-center text-xl font-black text-blue-600">
              {attemptResult.percentage}%
            </div>
            <h3 className="text-2xl font-bold text-slate-900">
              Score: {attemptResult.score} / {attemptResult.totalQuestions}
            </h3>
            <p className="text-sm font-medium mt-1 text-slate-500">
              {attemptResult.percentage >= 60
                ? '🎉 Excellent work! Your skill proficiency level has been upgraded.'
                : 'Review the detailed explanations below to cement your understanding.'}
            </p>
          </div>

          {/* Per-Question Explanations */}
          <div className="mt-8 space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Per-Question Diagnostic Explanations
            </h4>

            {attemptResult.answers.map((ans, idx) => (
              <div
                key={ans.questionId}
                className={`p-6 rounded-2xl border ${
                  ans.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start space-x-2">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      {idx + 1}. {ans.questionText}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {ans.isCorrect ? 'Correct (+1)' : 'Incorrect'}
                  </span>
                </div>

                <div className="space-y-1 mb-4 text-xs">
                  {ans.options.map((opt, oIdx) => {
                    const isChosen = ans.selectedOption === oIdx;
                    const isTargetCorrect = ans.correctAnswerIndex === oIdx;

                    let optStyle = 'text-slate-600';
                    if (isTargetCorrect) optStyle = 'text-emerald-700 font-bold';
                    else if (isChosen && !ans.isCorrect) optStyle = 'text-rose-700 line-through';

                    return (
                      <div key={oIdx} className={`py-1 px-2 rounded-lg flex items-center space-x-2 ${optStyle}`}>
                        <span>{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                        {isTargetCorrect && <span className="text-[10px] text-emerald-600 font-bold ml-auto">✓ Correct Answer</span>}
                        {isChosen && !ans.isCorrect && <span className="text-[10px] text-rose-600 ml-auto">Your Selection</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation text */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-0.5">Explanation:</span>
                  {ans.explanation}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => { setAttemptResult(null); setActiveQuizId(null); }}
              className="px-8 py-3 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Generate Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
