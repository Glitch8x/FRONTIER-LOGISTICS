import React, { useState, useEffect } from 'react';
import { 
  Trophy, Droplets, Zap, Shield, Menu, User, Settings, 
  ExternalLink, ArrowRight, Activity, Globe, MapPin, 
  Info, TrendingUp, AlertCircle, Camera, X, Edit3, Save, 
  ChevronRight, Users, Layers, BarChart3, Radio, Crosshair,
  Maximize2, Minimize2, Cpu
} from 'lucide-react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

// --- Types ---
interface Resource {
  id: string;
  label: string;
  color: string;
  bg: string;
  glow: string;
}

interface UserProfile {
  name: string;
  avatar: string | null;
  fleet: string | null;
  bio: string;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  name: string;
  volume: number;
  fleet: string | null;
}

// --- Configuration ---
const RESOURCES: Record<string, Resource> = {
  CRUDE: { id: 'crude', label: 'Crude Fuel', color: 'text-red-500', bg: 'bg-red-500', glow: 'neon-text-red' },
  EU40: { id: 'eu40', label: 'EU-40', color: 'text-orange-500', bg: 'bg-orange-500', glow: 'neon-text-orange' },
  EU90: { id: 'eu90', label: 'EU-90', color: 'text-purple-500', bg: 'bg-purple-500', glow: 'neon-text-purple' },
  SOF80: { id: 'sof80', label: 'SOF-80', color: 'text-yellow-500', bg: 'bg-yellow-500', glow: 'neon-text-yellow' }
};

const RANKS = {
  CRUDE_BARON: { label: 'Logistics Baron', color: 'text-red-400', icon: '👑' },
  REFINERY_MASTER: { label: 'Throughput Master', color: 'text-purple-400', icon: '💎' },
  FUEL_SPECIALIST: { label: 'Assembly Tech', color: 'text-orange-400', icon: '⚡' },
};

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x7e...b4a1', name: 'Ishukone Industrial', volume: 1542000, fleet: 'Ishukone' },
  { rank: 2, address: '0x32...f9e2', name: 'Kaalakiota Logistics', volume: 1285000, fleet: 'MegaCorp' },
  { rank: 3, address: '0xda...c321', name: 'Sukuu-vesta Ops', volume: 982000, fleet: 'SuKu-Logi' },
  { rank: 4, address: '0x1c...aef0', name: 'Caldari Trader', volume: 756000, fleet: 'Caldari' },
  { rank: 5, address: '0x94...2b1c', name: 'Frontier Fueler', volume: 641000, fleet: null },
  { rank: 6, address: '0xbb...de32', name: 'Crude King', volume: 520000, fleet: 'Pirates' },
];

export default function App() {
  const account = useCurrentAccount();
  
  // Dashboard States
  const [activeResource, setActiveResource] = useState<Resource>(RESOURCES.CRUDE);
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [totalVolume, setTotalVolume] = useState(6415000);
  const [globalHealth, setGlobalHealth] = useState(94.2);
  const [chartData, setChartData] = useState<number[]>(Array.from({ length: 20 }, () => 30 + Math.random() * 40));
  
  // Mod Specific Logic
  const [cockpitMode, setCockpitMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  
  // Profile & Fleet States
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'You (Industrialist)',
    avatar: null,
    fleet: null,
    bio: 'Frontier Logistics Specialist'
  });

  // Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalVolume(v => v + Math.floor(Math.random() * 200) + 50);
      setGlobalHealth(h => Math.min(100, Math.max(90, h + (Math.random() - 0.5))));
      setChartData(prev => [...prev.slice(1), 30 + Math.random() * 50]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getRank = (volume: number) => {
    if (volume >= 1000000) return RANKS.CRUDE_BARON;
    if (volume >= 500000) return RANKS.REFINERY_MASTER;
    return RANKS.FUEL_SPECIALIST;
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-700 font-sans ${cockpitMode ? 'bg-black/95 scale-[0.98] rounded-[3rem] border-4 border-red-900/20' : 'bg-[#050505] text-gray-200 selection:bg-red-500/30'}`}>
      {!cockpitMode && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#400000_0%,transparent_60%)]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none scanline" />
        </>
      )}
      
      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal 
          account={account} 
          userProfile={userProfile} 
          setUserProfile={setUserProfile} 
          onClose={() => setShowProfile(false)} 
        />
      )}

      {/* Header */}
      <nav className={`relative z-10 border-b border-white/5 glass-morphism px-8 py-4 flex items-center justify-between transition-all ${cockpitMode ? 'bg-red-950/10' : ''}`}>
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-all ${cockpitMode ? 'bg-red-600/40 border-red-500' : 'bg-red-600/20 border-red-500/40 neon-glow'}`}>
            <Radio className={`w-7 h-7 text-red-500 ${cockpitMode ? 'animate-none' : 'animate-pulse'}`} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white italic uppercase flex items-center gap-2">
               {cockpitMode && <Cpu className="w-5 h-5 text-red-500" />} FRONTIER LOGISTICS OVERSIGHT
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-red-500 font-mono tracking-widest uppercase italic font-bold">
                 {cockpitMode ? 'IN-GAME HUD MODE ACTIVE' : 'Sector Phoenix Tactical Console'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
           {/* Mod Controls */}
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setCockpitMode(!cockpitMode)}
                title="Toggle Cockpit Mode (In-Game)"
                className={`p-2 rounded-lg transition-all ${cockpitMode ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {cockpitMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
           </div>

           <div className="hidden lg:flex items-center gap-12">
              <div className="flex items-center gap-4 border-l border-white/5 pl-12">
                  {Object.values(RESOURCES).map(res => (
                    <button 
                      key={res.id} 
                      onClick={() => setActiveResource(res)}
                      className={`px-4 py-2 text-[10px] uppercase font-black tracking-widest transition-all rounded ${activeResource.id === res.id ? res.bg + ' text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {res.label}
                    </button>
                  ))}
              </div>

              <div className="flex items-center gap-6">
                  {account && (
                    <button 
                      onClick={() => setShowProfile(true)}
                      className="flex items-center gap-4 px-3 py-1.5 hover:bg-white/5 rounded-xl transition-all"
                    >
                        <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 overflow-hidden">
                          {userProfile.avatar ? (
                            <img src={userProfile.avatar} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${account.address}`} className="w-full h-full opacity-60" alt="Bot Avatar" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] text-red-500 font-black tracking-widest uppercase">Operator ID</p>
                          <p className="text-[10px] font-bold text-white truncate max-w-[100px]">{userProfile.name}</p>
                        </div>
                    </button>
                  )}
                  <div className="wallet-container theme-red">
                    <ConnectButton className="!bg-white/5 !hover:bg-red-600/20 !text-white !rounded !font-black !transition-all !flex !items-center !gap-3 !border !border-white/10 !hover:border-red-500/50 !uppercase !tracking-widest !text-xs !px-6 !py-2.5 shadow-xl" />
                  </div>
              </div>
           </div>
        </div>
      </nav>

      {/* Hero Stats */}
      <div className={`relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-white/5 border-b border-white/5 divide-x divide-white/5 transition-all ${compactView ? 'hidden' : 'flex'}`}>
        <StatBlock label="Operational Power" value={totalVolume.toLocaleString()} unit={activeResource.label} icon={<TrendingUp className="text-red-500" />} cockpit={cockpitMode} />
        <StatBlock label="Grid Stability" value={`${globalHealth.toFixed(1)}%`} unit="Status" icon={<Activity className="text-red-600" />} cockpit={cockpitMode} />
        <StatBlock label="Active Coalitions" value="12" unit="Fleets" icon={<Users className="text-orange-500" />} cockpit={cockpitMode} />
        <StatBlock label="Sector Map Status" value="SYNCING" unit="Tactical" icon={<Globe className="text-yellow-600" />} cockpit={cockpitMode} />
      </div>

      <main className={`relative z-10 mx-auto px-8 py-10 transition-all ${cockpitMode ? 'max-w-[1400px]' : 'max-w-[1800px]'}`}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Main Visual Intelligence (Left Col) */}
          <div className={`space-y-10 transition-all ${compactView ? 'hidden' : 'xl:col-span-4'}`}>
             {/* Tactical Sector Map */}
             <div className={`glass-morphism rounded-3xl border p-8 space-y-6 relative overflow-hidden bg-black/40 ${cockpitMode ? 'border-red-500/40 shadow-inner shadow-red-500/10' : 'border-white/5'}`}>
                <div className="flex items-center justify-between relative z-10">
                   <h3 className="text-xs font-black uppercase tracking-widest text-white italic flex items-center gap-2">
                      <Crosshair className="w-4 h-4 text-red-500" /> Sector Tactical Overlay
                   </h3>
                   <span className="text-[9px] font-mono text-red-500 uppercase font-black">Sync: {account ? account.address.slice(-4) : 'OFF'}</span>
                </div>
                <div className="relative w-full aspect-square border border-red-500/10 rounded-2xl bg-red-950/5 flex items-center justify-center group overflow-hidden">
                   <svg viewBox="0 0 200 200" className="w-full h-full opacity-40">
                      <circle cx="100" cy="100" r="100" className="stroke-white/5 fill-none" />
                      <circle cx="100" cy="100" r="60" className="stroke-white/5 fill-none" />
                      <line x1="100" y1="0" x2="100" y2="200" className="stroke-white/5" strokeDasharray="4 4" />
                      <line x1="0" y1="100" x2="200" y2="100" className="stroke-white/5" strokeDasharray="4 4" />
                      <circle cx="140" cy="60" r="6" className="fill-red-500/50 animate-ping" />
                      <circle cx="140" cy="60" r="3" className="fill-red-500" />
                      <circle cx="70" cy="130" r="3" className="fill-red-500/50" />
                      <circle cx="40" cy="50" r="2" className="fill-red-500/50" />
                   </svg>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <p className="text-[9px] font-black tracking-widest text-white/10 uppercase group-hover:text-red-500 transition-all cursor-crosshair">In-Game Scan Active</p>
                   </div>
                </div>
             </div>

             {/* Live Industrial History Chart */}
             <div className={`glass-morphism rounded-3xl border p-8 space-y-6 bg-black/40 relative overflow-hidden ${cockpitMode ? 'border-red-500/40 shadow-inner shadow-red-500/10' : 'border-white/5'}`}>
                <div className="absolute top-0 right-0 p-4">
                   <BarChart3 className="w-20 h-20 text-red-500 opacity-5 rotate-12" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white italic flex items-center gap-2 relative z-10">
                   <Activity className="w-4 h-4 text-red-500" /> Industrial Pulse (24h)
                </h3>
                <div className="h-40 w-full flex items-end gap-1 relative z-10">
                   {chartData.map((val, i) => (
                     <div 
                       key={i} 
                       className={`flex-1 border-t rounded-t-sm transition-all duration-1000 ${cockpitMode ? 'bg-red-600/40 border-red-500 shadow-lg shadow-red-500/30' : 'bg-red-600/20 border-red-500/40'}`}
                       style={{ height: `${val}%` }} 
                     />
                   ))}
                </div>
                <div className="flex justify-between text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                   <span>Telemetry</span>
                   <span className="text-red-500 font-black">Live Link</span>
                   <span>{new Date().toLocaleTimeString()}</span>
                </div>
             </div>
          </div>

          {/* Leaderboard Table (Center/Right Col) */}
          <div className={`${compactView ? 'xl:col-span-12' : 'xl:col-span-8'} space-y-8`}>
            <div className="flex justify-between items-end">
              <div>
                <h2 className={`text-4xl font-black italic tracking-tighter flex items-center gap-4 ${cockpitMode ? 'text-red-500' : 'text-white'}`}>
                  <Trophy className="text-yellow-600 w-10 h-10" /> REFINERY KINGS
                </h2>
                <div className="mt-2 flex items-center gap-4">
                   <span className={`px-3 py-1 font-black text-[10px] text-white uppercase tracking-[0.2em] italic ${cockpitMode ? 'bg-red-700' : 'bg-red-600'}`}>Tier: Industrial-Oversight</span>
                   <p className="text-gray-500 text-sm font-medium italic opacity-70">Cross-sector fuel relocation monitoring.</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setCompactView(!compactView)} className="px-5 py-3 glass-morphism rounded-xl text-[10px] uppercase font-black tracking-widest hover:bg-white/10 transition-all border border-white/5">
                   {compactView ? 'Standard View' : 'HUD View'}
                 </button>
                 <button className={`px-5 py-3 glass-morphism rounded-xl text-[10px] uppercase font-black tracking-widest transition-all border flex items-center gap-2 ${cockpitMode ? 'bg-red-600 text-white border-red-400' : 'hover:bg-red-600/20 text-red-500 border-red-500/20'}`}>
                   <Users className="w-4 h-4" /> Global Coalitions
                 </button>
              </div>
            </div>

            <div className={`glass-morphism rounded-[2.5rem] overflow-hidden border shadow-2xl bg-black/40 transition-all ${cockpitMode ? 'border-red-500/40 scale-[0.99] shadow-red-500/10' : 'border-white/5'}`}>
              {/* Grid Header */}
              <div className="grid grid-cols-[120px_2fr_1.5fr_220px] bg-white/5 text-[9px] uppercase tracking-[0.3em] font-black text-gray-500 border-b border-white/10 px-8 py-6">
                <div className="text-center">POS</div>
                <div>Industrial Entity</div>
                <div>Output (u)</div>
                <div className="text-right pr-6">Status</div>
              </div>

              {/* Grid Rows */}
              <div className="divide-y divide-white/5">
                {leaderboard.map((player, i) => {
                  const rankInfo = getRank(player.volume);
                  const isUser = account && player.address.toLowerCase() === account.address.toLowerCase();
                  return (
                    <div key={player.address} className={`grid grid-cols-[120px_2fr_1.5fr_220px] items-center px-8 py-8 group transition-all duration-300 relative ${isUser ? 'bg-red-600/10' : 'hover:bg-red-600/5'}`}>
                      <div className="flex justify-center h-full items-center">
                        <span className={`text-5xl font-black italic tracking-tighter transition-all opacity-10 group-hover:opacity-40 leading-none ${isUser ? 'text-red-500 opacity-100' : 'text-white'}`}>
                          {i + 1 < 10 ? `0${i + 1}` : i + 1}
                        </span>
                      </div>

                      {/* Identity */}
                      <div className="flex items-center gap-6 overflow-hidden">
                        <div className={`w-14 h-14 shrink-0 rounded-xl border flex items-center justify-center bg-black transition-all ${isUser ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'border-white/10 group-hover:border-white/20'}`}>
                           <img 
                             src={isUser && userProfile.avatar ? userProfile.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${player.address}`} 
                             alt="Entity" className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-all" 
                           />
                        </div>
                        <div className="flex flex-col gap-1.5 min-w-0">
                          <span className={`text-xl font-bold leading-tight truncate transition-all ${isUser ? 'text-red-500 italic' : 'text-white/80 group-hover:text-white'}`}>{player.name}</span>
                          <div className="flex items-center gap-2 leading-none">
                             <span className="font-mono text-[9px] text-gray-600 font-black tracking-widest">{player.address.slice(0, 10)}...</span>
                             {player.fleet && (
                               <span className="flex items-center gap-1 text-[8px] font-black px-2 py-0.5 border border-red-500/30 text-red-500 rounded uppercase">
                                 <Shield className="w-2.5 h-2.5" /> {player.fleet}
                               </span>
                             )}
                          </div>
                        </div>
                      </div>

                      {/* Output */}
                      <div className="flex flex-col gap-3 pr-8">
                         <div className="flex items-baseline gap-2 leading-none">
                           <span className={`text-4xl font-black font-mono tracking-tighter ${isUser ? 'text-red-500 font-black' : 'text-white'}`}>{player.volume.toLocaleString()}</span>
                           <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest leading-none">Units</span>
                         </div>
                         <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                            <div className={`h-full absolute left-0 top-0 transition-all duration-1000 ${isUser ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'bg-red-900 group-hover:bg-red-700'}`} style={{ width: `${(player.volume / leaderboard[0].volume) * 100}%` }} />
                         </div>
                      </div>

                      {/* Status */}
                      <div className="flex justify-end pr-6">
                         <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border bg-black/40 ${isUser ? 'text-red-500 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : rankInfo.color + ' border-current/20'} text-[10px] uppercase font-black tracking-[0.2em] italic transition-all group-hover:scale-105 group-hover:bg-red-600/5`}>
                           <span className="animate-pulse">{rankInfo.icon}</span>
                           <span>{rankInfo.label}</span>
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={`relative z-10 py-20 px-10 text-center flex flex-col items-center gap-8 border-t border-white/5 max-w-[1200px] mx-auto transition-all ${compactView ? 'hidden' : 'flex'}`}>
        <p className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.6em] font-black">EVE FRONTIER | INDUSTRIAL MOD v1.0.4</p>
      </footer>
    </div>
  );
}

// --- Subcomponents ---

interface StatBlockProps {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  cockpit?: boolean;
}

function StatBlock({ label, value, unit, icon, cockpit }: StatBlockProps) {
  return (
    <div className={`glass-morphism p-10 hover:bg-white/5 transition-all group relative overflow-hidden ${cockpit ? 'bg-red-950/5' : ''}`}>
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600/30 group-hover:bg-red-500 transition-all" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] group-hover:text-red-500 transition-all">{label}</span>
        <div className={`p-3 rounded-xl border transition-all ${cockpit ? 'bg-red-900/20 border-red-500' : 'bg-black/40 border-white/10 group-hover:border-red-500/50'}`}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-black text-white tracking-tighter group-hover:drop-shadow-[0_0_10px_rgba(255,0,0,0.2)] transition-all italic">{value}</span>
        <span className="text-[10px] text-red-700 uppercase font-black tracking-widest">{unit}</span>
      </div>
    </div>
  );
}

interface ProfileModalProps {
  account: any;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onClose: () => void;
}

function ProfileModal({ account, userProfile, setUserProfile, onClose }: ProfileModalProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (f) => setUserProfile({ ...userProfile, avatar: f.target?.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-2xl bg-black/80">
      <div className="relative w-full max-w-2xl glass-morphism rounded-[3rem] border border-red-500/30 overflow-hidden shadow-[0_0_150px_rgba(255,0,0,0.2)]">
        <div className="p-12 space-y-10 bg-black/60 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase font-black">Authorized ID</h3>
              <p className="text-[10px] text-red-500 font-mono tracking-widest mt-1 uppercase">Oversight Compliance System</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5">
              <X className="w-6 h-6 text-red-500" />
            </button>
          </div>

          <div className="flex items-center gap-10 p-8 rounded-[2rem] bg-white/5 border border-white/5">
            <div className="relative group overflow-visible">
              <div className="w-32 h-32 rounded-3xl border-2 border-red-500/40 overflow-hidden bg-black shadow-2xl group-hover:scale-105 transition-all">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${account?.address}`} className="w-full h-full opacity-60" alt="Avatar" />
                )}
              </div>
              <label className="absolute -bottom-3 -right-3 bg-red-600 hover:bg-red-500 p-3 rounded-xl cursor-pointer shadow-xl transition-all border border-red-400">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>
            <div className="space-y-4 flex-1">
               <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black tracking-widest text-red-500">Authorized Signature</label>
                  <p className="text-xs font-mono text-white/50 truncate max-w-[200px]">{account?.address || 'UNAUTHORIZED_ACCESS'}</p>
               </div>
               <input 
                 type="text" 
                 value={userProfile.name}
                 onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                 className="w-full bg-black/40 border-b-2 border-white/10 focus:border-red-600 rounded-lg px-0 py-3 text-xl text-white outline-none transition-all placeholder:text-gray-700 font-bold italic"
                 placeholder="Claim Identity..."
               />
            </div>
          </div>

          <button onClick={onClose} className="w-full py-6 bg-red-600 hover:bg-red-500 text-white font-black rounded-[1.5rem] transition-all shadow-[0_20px_60px_rgba(220,38,38,0.3)] uppercase tracking-[0.3em] flex items-center justify-center gap-4">
             <Radio className="w-5 h-5 animate-pulse" /> SYNCHRONIZE COMMAND DATA
          </button>
        </div>
      </div>
    </div>
  );
}
