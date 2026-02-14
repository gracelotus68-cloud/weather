
import React from 'react';
import { WeatherData } from '../types';
import { ExternalLink, Sparkles, BookOpen, Cloud, Sun, Umbrella } from 'lucide-react';

interface Props {
  data: WeatherData;
}

const WeatherDisplay: React.FC<Props> = ({ data }) => {
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return null;
      return (
        <p key={i} className="mb-4 leading-relaxed text-slate-800 drop-shadow-sm font-medium">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      {/* Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-yellow-300 via-orange-400 to-pink-500 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl shadow-orange-300/40">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-white/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-float-fast"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
              <span className="text-xs font-black tracking-widest uppercase">AI Caster Report</span>
            </div>
            <div className="flex gap-2">
                <Sun className="w-8 h-8 text-yellow-100 opacity-60" />
                <Cloud className="w-8 h-8 text-white opacity-40" />
                <Umbrella className="w-8 h-8 text-pink-100 opacity-60" />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
              {data.location}
            </h2>
            <p className="text-xl text-white/90 font-bold opacity-90">오늘의 날씨는 어떨까요? ✨</p>
          </div>

          <div className="glass-card rounded-[2rem] p-8 text-slate-900 shadow-xl">
             <div className="max-w-none">
                {renderText(data.forecast)}
             </div>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      {data.sources.length > 0 && (
        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-orange-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-2xl">
              <BookOpen className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">AI가 참고한 생생한 정보들</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white border-2 border-orange-50 rounded-2xl hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-1 transition-all group"
              >
                <span className="text-sm text-slate-700 font-bold truncate pr-3 group-hover:text-orange-500">
                  {source.title}
                </span>
                <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer Quote */}
      <div className="text-center space-y-2 py-4">
        <p className="text-sm font-black text-orange-400 uppercase tracking-[0.3em]">Be Bright & Stay Fresh</p>
        <p className="text-[11px] text-slate-400 px-8 leading-relaxed max-w-lg mx-auto italic">
          AI 분석 특성상 실제 날씨와 톡 쏘는 차이가 있을 수 있으니 외출 전 창밖을 한 번 더 확인해 주세요! 🎈
        </p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
