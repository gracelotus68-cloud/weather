
import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeatherAnalysis } from './services/geminiService';
import { WeatherData, GeolocationState } from './types';
import WeatherDisplay from './components/WeatherDisplay';
import { MapPin, Search, Loader2, CloudSun, Wind, Thermometer, Info } from 'lucide-react';

const App: React.FC = () => {
  const [geo, setGeo] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    isLoading: true,
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchCity, setSearchCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const getWeatherData = useCallback(async (lat: number, lng: number, city?: string) => {
    setIsSearching(true);
    try {
      const data = await fetchWeatherAnalysis(lat, lng, city);
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeo({ lat: latitude, lng: longitude, error: null, isLoading: false });
          getWeatherData(latitude, longitude);
        },
        (error) => {
          setGeo({ lat: null, lng: null, error: "위치 권한을 허용해주세요.", isLoading: false });
        }
      );
    } else {
      setGeo({ lat: null, lng: null, error: "브라우저가 위치 정보를 지원하지 않습니다.", isLoading: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      getWeatherData(0, 0, searchCity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white text-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-orange-500 font-black text-2xl tracking-tighter">
            <CloudSun className="w-8 h-8 text-yellow-400 fill-current" />
            <span className="hidden sm:inline">AI Caster</span>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="궁금한 도시를 검색해보세요!"
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 border-2 border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all outline-none text-sm placeholder:text-slate-400"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            <Search className="absolute left-3 top-3 w-5 h-5 text-orange-300" />
            <button type="submit" className="hidden">검색</button>
          </form>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/50 rounded-full text-[11px] font-bold text-orange-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[80px]">
              {geo.lat ? `${geo.lat.toFixed(1)}, ${geo.lng?.toFixed(1)}` : '내 위치'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8 relative">
        {geo.isLoading || isSearching ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-orange-400 animate-spin" />
              <CloudSun className="absolute inset-0 m-auto w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-orange-600 font-bold text-lg animate-pulse">상큼한 날씨 정보를 준비 중이에요!</p>
          </div>
        ) : geo.error && !weather ? (
          <div className="bg-white border-4 border-dashed border-orange-100 p-10 rounded-[2.5rem] text-center shadow-sm">
            <Info className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <p className="text-slate-700 font-bold text-xl mb-2">{geo.error}</p>
            <p className="text-slate-400 mb-8">상단 검색창에 도시 이름을 입력하면 바로 알려드릴게요!</p>
          </div>
        ) : weather ? (
          <WeatherDisplay data={weather} />
        ) : (
          <div className="text-center py-32 text-slate-300">
            <CloudSun className="w-24 h-24 mx-auto mb-6 opacity-30 animate-bounce" />
            <p className="text-xl font-medium">어디의 날씨가 궁금하신가요?</p>
          </div>
        )}
      </main>

      {/* Footer Navigation (Mobile) */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-orange-200/50 rounded-3xl px-6 py-4 flex justify-around items-center md:hidden z-50">
        <button className="flex flex-col items-center gap-1 text-orange-500">
          <Thermometer className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Weather</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Wind className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Wind</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
