
import React, { useState, useEffect, useCallback } from 'react';
import { Language, EducationalContent, UserProfile } from './types';
import { DEFAULT_PROFILE_KEY, APP_NAME } from './constants';
import { generateEducationalContent } from './services/geminiService';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Globe, 
  CheckCircle2, 
  History, 
  User, 
  Loader2, 
  AlertCircle,
  Lightbulb,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GlassCard from './components/GlassCard';
import VisualAnalogy from './components/VisualAnalogy';
import ResourceList from './components/ResourceList';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.ENGLISH_IN);
  const [content, setContent] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Initialize profile on mount
  useEffect(() => {
    const saved = localStorage.getItem(DEFAULT_PROFILE_KEY);
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      const newProfile: UserProfile = {
        sessionId: Math.random().toString(36).substring(7),
        preferredLanguage: Language.ENGLISH_IN,
        recentTopics: [],
        engagement: {
          totalRequests: 0,
          lastActive: new Date().toISOString()
        }
      };
      setProfile(newProfile);
      localStorage.setItem(DEFAULT_PROFILE_KEY, JSON.stringify(newProfile));
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await generateEducationalContent(topic, selectedLanguage);
      setContent(result);
      
      // Update profile
      if (profile) {
        const updated: UserProfile = {
          ...profile,
          recentTopics: [topic, ...profile.recentTopics.filter(t => t !== topic)].slice(0, 5),
          engagement: {
            totalRequests: profile.engagement.totalRequests + 1,
            lastActive: new Date().toISOString()
          },
          preferredLanguage: selectedLanguage
        };
        setProfile(updated);
        localStorage.setItem(DEFAULT_PROFILE_KEY, JSON.stringify(updated));
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (t: string) => {
    setTopic(t);
  };

  return (
    <div className="min-h-screen text-white pb-20 overflow-x-hidden">
      {/* Header */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl shadow-indigo-500/20 shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">{APP_NAME}</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium">
            <User className="w-4 h-4" />
            <span>Learner Mode</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <div className="flex items-center gap-2 text-indigo-100 text-sm font-semibold px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>{profile?.engagement.totalRequests || 0} Topics Mastered</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Search Section */}
        <section className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Learn anything from your <span className="text-indigo-300">Guru Jii</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-8 opacity-90">
            Explain complex topics in your preferred language using AI-powered simplifications.
          </p>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ask me anything: Quantum Physics, Photosynthesis, Stock Market..."
                  className="w-full bg-transparent border-none focus:ring-0 pl-12 pr-4 py-4 text-white placeholder-indigo-300 text-lg"
                />
              </div>
              <div className="flex items-center gap-2 px-2">
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-400 outline-none appearance-none cursor-pointer"
                >
                  <option value={Language.ENGLISH_IN} className="bg-indigo-900">English (IN)</option>
                  <option value={Language.HINDI} className="bg-indigo-900">Hindi (हिंदी)</option>
                  <option value={Language.HINGLISH} className="bg-indigo-900">Hinglish</option>
                </select>
                <button 
                  disabled={loading || !topic.trim()}
                  className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )}
                  {loading ? 'Thinking...' : 'Start Learning'}
                </button>
              </div>
            </div>
            
            {profile && profile.recentTopics.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <div className="flex items-center gap-1 text-xs text-indigo-200 font-medium uppercase tracking-widest mr-2">
                  <History className="w-3 h-3" />
                  Recent:
                </div>
                {profile.recentTopics.map((t, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleTopicClick(t)}
                    className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 rounded-full transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </form>
        </section>

        {/* Error State */}
        {error && (
          <div className="max-w-3xl mx-auto mb-12">
            <GlassCard className="border-red-500/30 bg-red-500/5">
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle className="w-6 h-6" />
                <p className="font-medium">{error}</p>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-48 glass rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80 glass rounded-2xl"></div>
              <div className="h-80 glass rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* Content Section (Bento Grid) */}
        {content && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* EL15 (Explain Like I'm 15) - Hero Card */}
            <div className="lg:col-span-12">
              <GlassCard title="Quick Summary (EL15)" icon={<Lightbulb className="w-6 h-6" />}>
                <p className="text-xl md:text-2xl font-medium text-indigo-50 leading-relaxed italic">
                  "{content.el15}"
                </p>
              </GlassCard>
            </div>

            {/* Deep Dive Section */}
            <div className="lg:col-span-8">
              <GlassCard title="The Deep Dive" icon={<FileText className="w-6 h-6" />}>
                <article className="prose prose-invert prose-indigo max-w-none">
                  <ReactMarkdown>{content.deepDive}</ReactMarkdown>
                </article>
              </GlassCard>
            </div>

            {/* Visual Analogy & Resources Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <VisualAnalogy 
                analogy={content.visualAnalogy} 
                imageUrl={content.imageUrl} 
              />
              <ResourceList resources={content.resources} />
            </div>

          </div>
        )}

        {/* Onboarding Empty State */}
        {!content && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 opacity-80">
            <GlassCard title="Choose Language" icon={<Globe className="w-6 h-6" />}>
              <p className="text-sm text-indigo-100">Toggle between pure Hindi, Hinglish, or Indian English for better comprehension.</p>
            </GlassCard>
            <GlassCard title="Bento Learning" icon={<Sparkles className="w-6 h-6" />}>
              <p className="text-sm text-indigo-100">Get structured information: summaries, deep dives, analogies, and verified resources.</p>
            </GlassCard>
            <GlassCard title="Visual Memory" icon={<ImageIcon className="w-6 h-6" />}>
              <p className="text-sm text-indigo-100">Every topic comes with an AI-generated visual analogy to help you remember abstract concepts.</p>
            </GlassCard>
          </div>
        )}
      </main>

      <footer className="mt-20 py-8 text-center text-indigo-300 text-sm opacity-60">
        <p>© 2024 Guru Jii Learning Platform • Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
