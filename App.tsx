
import React, { useState, useEffect } from 'react';
import { OperationMode, Message, SystemState } from './types';
import { ariseService } from './services/gemini';
import { mockService } from './services/mockData';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<OperationMode>(OperationMode.OMNI_ARCHITECT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [startTime] = useState(new Date());

  const [systemState, setSystemState] = useState<SystemState>({
    isOperational: true,
    isMockEnabled: false,
    activeMode: OperationMode.OMNI_ARCHITECT,
    latency: 0,
    uptime: '00:00:00',
    governorStatus: 'ARCHITECT_CORE_V32'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
      const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const secs = (diff % 60).toString().padStart(2, '0');
      setSystemState(prev => ({ ...prev, uptime: `${hours}:${mins}:${secs}` }));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => console.warn("Spatial Core: Geolocation anchored to static observer", err)
      );
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    const startTimeReq = performance.now();
    
    let result;
    if (systemState.isMockEnabled) {
      result = await mockService.execute(input, mode);
    } else {
      result = await ariseService.execute(input, mode, userLocation);
    }
    
    const endTimeReq = performance.now();

    const assistantMsg: Message = {
      role: 'assistant',
      content: result.text,
      timestamp: new Date(),
      mode: mode,
      groundingLinks: result.links,
      isMock: systemState.isMockEnabled
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsProcessing(false);
    setSystemState(prev => ({ 
      ...prev, 
      latency: Math.round((endTimeReq - startTimeReq) * (systemState.isMockEnabled ? 1 : 5.2)),
      activeMode: mode 
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMock = () => {
    setSystemState(prev => ({ ...prev, isMockEnabled: !prev.isMockEnabled }));
  };

  return (
    <div className="flex flex-col h-screen max-h-screen relative selection:bg-violet-600/40 selection:text-white bg-[#010103]">
      <Header 
        state={systemState} 
        showSidebar={showSidebar} 
        onToggleSidebar={() => setShowSidebar(!showSidebar)} 
      />

      <main className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Sidebar */}
        <aside className={`fixed md:relative z-30 h-full border-r border-violet-500/10 bg-[#010102] transition-all duration-500 ease-in-out ${
          showSidebar ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        } flex flex-col gap-8 p-0 overflow-hidden`}>
          <div className="p-8 w-80 space-y-8 h-full flex flex-col">
            <div className="text-[10px] text-violet-500/50 uppercase font-black tracking-[0.5em] mb-2">System Vectors</div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setMode(OperationMode.OMNI_ARCHITECT)}
                className={`w-full flex items-start gap-4 p-4 transition-all duration-300 border ${
                  mode === OperationMode.OMNI_ARCHITECT 
                    ? 'border-violet-500 bg-violet-600/10 text-violet-200' 
                    : 'border-white/5 text-gray-700 hover:border-white/20'
                }`}
              >
                <i className="fas fa-building mt-1"></i>
                <div className="text-left">
                  <div className="text-[12px] font-black uppercase tracking-widest">Omni-Architect</div>
                  <div className="text-[9px] opacity-40 font-mono mt-0.5">ARCHITECTURAL_MODELING</div>
                </div>
              </button>

              <button 
                onClick={() => setMode(OperationMode.QUANTUM_INTEL)}
                className={`w-full flex items-start gap-4 p-4 transition-all duration-300 border ${
                  mode === OperationMode.QUANTUM_INTEL 
                    ? 'border-fuchsia-500 bg-fuchsia-600/10 text-fuchsia-200' 
                    : 'border-white/5 text-gray-700 hover:border-white/20'
                }`}
              >
                <i className="fas fa-microchip mt-1"></i>
                <div className="text-left">
                  <div className="text-[12px] font-black uppercase tracking-widest">Quantum_Intel</div>
                  <div className="text-[9px] opacity-40 font-mono mt-0.5">DATA_SYNTHESIS</div>
                </div>
              </button>

              <button 
                onClick={() => setMode(OperationMode.REALITY_MAPPING)}
                className={`w-full flex items-start gap-4 p-4 transition-all duration-300 border ${
                  mode === OperationMode.REALITY_MAPPING 
                    ? 'border-indigo-500 bg-indigo-600/10 text-indigo-200' 
                    : 'border-white/5 text-gray-700 hover:border-white/20'
                }`}
              >
                <i className="fas fa-map mt-1"></i>
                <div className="text-left">
                  <div className="text-[12px] font-black uppercase tracking-widest">Reality_Mapping</div>
                  <div className="text-[9px] opacity-40 font-mono mt-0.5">SPATIAL_VECTOR_ANALYSIS</div>
                </div>
              </button>
            </div>

            <div className="pt-10 border-t border-white/5 space-y-6">
              <div className="space-y-3">
                <div className="text-[10px] text-violet-500/50 uppercase font-black tracking-[0.4em]">Data Layer</div>
                <button 
                  onClick={toggleMock}
                  className={`w-full flex items-center justify-between p-3 border transition-all ${
                    systemState.isMockEnabled 
                    ? 'border-amber-500/50 bg-amber-500/5 text-amber-400' 
                    : 'border-violet-500/30 bg-violet-500/5 text-violet-400'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {systemState.isMockEnabled ? 'LOCAL_HYPERCACHE' : 'LIVE_NEURAL_LINK'}
                  </span>
                  <i className={`fas ${systemState.isMockEnabled ? 'fa-toggle-on' : 'fa-toggle-off'} text-lg`}></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-600 uppercase font-black">Storage Index</span>
                  <span className="text-violet-500 font-mono">128.4GB_SYNC</span>
                </div>
                <div className="flex gap-1 h-0.5 w-full bg-white/5">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`h-full flex-1 ${i < 12 ? 'bg-violet-500/50' : 'bg-white/5'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto text-[8px] text-gray-700 font-mono tracking-widest uppercase">
              Core_Rev: 32.5.2-ARCH
            </div>
          </div>
        </aside>

        {/* Main Interface Area (Expansion Mode) */}
        <section className={`flex-1 flex flex-col bg-[#010102] transition-all duration-500 ${showSidebar ? 'md:ml-0' : 'w-full'}`}>
          <ChatInterface messages={messages} isThinking={isProcessing} />

          {/* Minimal Immersive Input */}
          <div className="px-8 pb-8 pt-4 bg-[#010102] relative">
            <div className="max-w-4xl mx-auto relative group">
              <div className={`absolute -inset-0.5 rounded-none blur opacity-0 group-focus-within:opacity-100 transition duration-1000 ${
                systemState.isMockEnabled ? 'bg-amber-500/10' : 'bg-violet-500/10'
              }`}></div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={systemState.isMockEnabled ? "INITIATE OFFLINE SIMULATION SEQUENCE..." : "INITIATE ARCHITECTURAL ANALYSIS..."}
                className={`relative w-full bg-black border rounded-none p-6 pr-24 font-mono text-[14px] tracking-tight leading-relaxed transition-all ${
                  systemState.isMockEnabled 
                  ? 'border-amber-500/20 text-amber-100 placeholder-amber-900/30 focus:border-amber-500/40' 
                  : 'border-white/5 text-violet-100 placeholder-white/10 focus:border-violet-500/40'
                }`}
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={isProcessing || !input.trim()}
                className={`absolute right-4 bottom-4 w-12 h-12 rounded-none flex items-center justify-center transition-all ${
                  input.trim() && !isProcessing 
                  ? (systemState.isMockEnabled ? 'bg-amber-600 text-white' : 'bg-violet-600 text-white')
                  : 'bg-white/5 text-white/10 cursor-not-allowed'
                }`}
              >
                <i className={`fas ${isProcessing ? 'fa-sync fa-spin' : 'fa-terminal'} text-xl`}></i>
              </button>
            </div>
            <div className="flex justify-between items-center max-w-4xl mx-auto mt-4 px-1">
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 ${systemState.isMockEnabled ? 'bg-amber-500 animate-pulse' : 'bg-violet-500/40'}`}></span>
                <span className={`text-[8px] uppercase tracking-[0.4em] font-black ${systemState.isMockEnabled ? 'text-amber-500/70' : 'text-gray-700'}`}>
                  {systemState.isMockEnabled ? 'LOCAL_HYPERCACHE_SIMULATION_ACTIVE' : 'STRUCTURAL_SIMULATION_ACTIVE'}
                </span>
              </div>
              <div className="text-[8px] text-gray-800 uppercase tracking-[0.4em] font-black">
                ARCHITECT_UI_PRO_v32
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
