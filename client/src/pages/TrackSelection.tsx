import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillTrack } from '../types';
import { Layout, BarChart2, Cloud, Cpu, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TrackSelectionProps {
  onTrackSelected: (track: SkillTrack) => void;
}

export const TrackSelection: React.FC<TrackSelectionProps> = ({ onTrackSelected }) => {
  const { user, refreshProfile } = useAuth();
  const [tracks, setTracks] = useState<SkillTrack[]>([]);
  const [selectedId, setSelectedId] = useState<string>('frontend-dev');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const { tracks: fetched } = await api.getTracks();
        setTracks(fetched);
        if (user?.targetTrackId) {
          setSelectedId(user.targetTrackId);
        } else if (fetched.length > 0) {
          setSelectedId(fetched[0].id);
        }
      } catch (err) {
        console.error('Failed to load tracks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, [user]);

  const handleConfirm = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await api.selectTrack(user.uid, selectedId);
      await refreshProfile();
      onTrackSelected(res.track);
    } catch (err) {
      console.error('Failed to select track:', err);
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return Layout;
      case 'BarChart2': return BarChart2;
      case 'Cloud': return Cloud;
      case 'Cpu': return Cpu;
      default: return Layers;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedTrack = tracks.find(t => t.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      {/* Step Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Step 1: Choose Your Specialization
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
          Select Your Target Career Track
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Skill Setu will calibrate its benchmark requirements and gap analysis specifically to this role.
        </p>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {tracks.map((track) => {
          const IconComp = getIcon(track.icon);
          const isSelected = track.id === selectedId;

          return (
            <div
              key={track.id}
              onClick={() => setSelectedId(track.id)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative ${
                isSelected
                  ? 'bg-white border-blue-600 shadow-soft ring-2 ring-blue-600/20'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-blue-600">
                  <CheckCircle2 className="w-5 h-5 fill-blue-50" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                isSelected ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}>
                <IconComp className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {track.trackName}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                {track.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>{track.skills.length} core competencies</span>
                <span className="font-semibold text-slate-700">Level 1 - 5</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Track Skill Blueprint Preview */}
      {selectedTrack && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Required Competencies</span>
              <h4 className="text-xl font-bold text-slate-900 mt-1">{selectedTrack.trackName} Blueprint</h4>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center space-x-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                Benchmark: Level {Math.round(selectedTrack.skills.reduce((a, b) => a + b.targetLevel, 0) / selectedTrack.skills.length)}/5 Avg
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedTrack.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800">{skill.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-700">
                    Target {skill.targetLevel}/5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Proceed Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConfirm}
          disabled={saving}
          className="px-10 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <span>{saving ? 'Saving...' : 'Proceed to Skill Assessment'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
