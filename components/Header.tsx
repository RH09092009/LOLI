
import React, { useEffect, useState } from 'react';
import { SystemState } from '../types';

interface HeaderProps {
  state: SystemState;
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ state, showSidebar, onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={`border-b bg-[#010103]/95 backdrop-blur-md px-6 py-3 flex justify-between items-center sticky top-0 z-40 transition-colors ${state.isMockEnabled ? 'border-amber-500/20' : 'border-violet-500/20'}`}>
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleSidebar}
          className={`w-10 h-10 flex items-center justify-center transition-all border ${
            showSidebar 
            ? (state.isMockEnabled ? 'bg-amber-600 border-amber-400' : 'bg-violet-600 border-violet-400') 
            : 'border-white/10 hover:border-violet-500/50'
          }`}
          title="Toggle Control Vectors"
        >
          <i className={`fas ${showSidebar ? 'fa-times' : 'fa-bars'} text-sm`}></i>
        </button>
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <div className={`w-8 h-8 border flex items-center justify-center transition-colors ${state.isMockEnabled ? 'bg-amber-600/20 border-amber-500/40' : 'bg-violet-600/20 border-violet-500/40'}`}>
            <i className={`fas ${state.isMockEnabled ? 'fa-hard-drive' : 'fa-microchip'} transition-colors ${state.isMockEnabled ? 'text-amber-400' : 'text-violet-400'} text-sm animate-pulse`}></i>
          </div>
          <div>
            <h1 className={`text-lg font-black tracking-widest uppercase leading-none transition-colors ${state.isMockEnabled ? 'text-amber-100' : 'text-violet-100'}`}>
              V32_{state.isMockEnabled ? 'OFFLINE' : 'SIM'}
            </h1>
            <p className={`text-[7px] uppercase tracking-[0.6em] font-black mt-1 transition-colors ${state.isMockEnabled ? 'text-amber-500/60' : 'text-violet-500/60'}`}>
              {state.isMockEnabled ? 'Hypercache Simulation' : 'Sovereign Authority'}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-4 gap-10 text-[9px] uppercase font-mono tracking-tighter">
        <div className="flex flex-col">
          <span className="text-gray-700 font-black">Data Origin</span>
          <span className={`font-black transition-colors ${state.isMockEnabled ? 'text-amber-400' : 'text-violet-400'}`}>
            {state.isMockEnabled ? "LOCAL_STORAGE" : "NEURAL_SYNAPSE"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-700 font-black">Processor Load</span>
          <span className={`font-black transition-colors ${state.isMockEnabled ? 'text-amber-500' : 'text-fuchsia-400'}`}>
            {state.isMockEnabled ? "LOW_EMULATION" : "98.42%_ACTIVE"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-700 font-black">System Time</span>
          <span className="text-gray-400">{currentTime.toLocaleTimeString()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-700 font-black">Access Protocol</span>
          <span className="text-gray-500">{state.isMockEnabled ? "SIM_UNRESTRICTED" : "USR_SIM_882"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full animate-ping transition-colors ${state.isMockEnabled ? 'bg-amber-500' : 'bg-violet-500'}`}></div>
        <div className={`text-[10px] font-black font-mono transition-colors ${state.isMockEnabled ? 'text-amber-500/50' : 'text-violet-500/50'}`}>
          {state.isMockEnabled ? 'LOCAL_BYPASS_MODE' : 'ENCRYPTED_LINK'}
        </div>
      </div>
    </header>
  );
};

export default Header;
