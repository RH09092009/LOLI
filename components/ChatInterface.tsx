
import React, { useRef, useEffect } from 'react';
import { Message, OperationMode } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isThinking: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isThinking }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scroll-smooth bg-transparent relative">
      {/* Immersive Structural Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ 
             backgroundImage: 'linear-gradient(#8b5cf6 0.5px, transparent 0.5px), linear-gradient(90deg, #8b5cf6 0.5px, transparent 0.5px)', 
             backgroundSize: '100px 100px' 
           }}></div>

      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center select-none space-y-8">
          <div className="w-24 h-24 border-2 border-violet-500/20 flex items-center justify-center relative">
            <i className="fas fa-shield-halved text-4xl text-violet-500/40 animate-pulse"></i>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600"></div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-violet-100 tracking-[0.6em] mb-4 uppercase">ARISE_CORE</h2>
            <div className="max-w-md mx-auto h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
            <p className="mt-4 uppercase text-[10px] tracking-[0.4em] font-black text-violet-500/60 leading-loose">
              SYSTEM_IDENT: V32_ARCHITECTURAL_GOVERNOR<br/>
              ANALYTICAL_SIMULATION_CORE_ACTIVE<br/>
              AWAITING_STRUCTURAL_DIRECTIVE
            </p>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`group flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-in fade-in duration-500'}`}
        >
          <div className="flex items-center gap-4 mb-3 px-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${msg.role === 'user' ? 'text-violet-400' : (msg.isMock ? 'text-amber-400' : 'text-fuchsia-400')}`}>
              {msg.role === 'user' ? '>> OPERATOR_SIG' : (msg.isMock ? '>> OFFLINE_BUFFER' : '>> ANALYST_SIM')}
            </span>
            <span className="text-[10px] text-gray-800 font-mono">
              LOG_{idx.toString().padStart(4, '0')}
            </span>
            {msg.isMock && (
              <span className="text-[9px] bg-amber-500/10 text-amber-500 px-1 border border-amber-500/20 font-black uppercase tracking-tighter">MOCK_LAYER</span>
            )}
          </div>

          <div 
            className={`max-w-[95%] md:max-w-[80%] p-8 md:p-10 rounded-none border relative shadow-[20px_20px_60px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500 ${
              msg.role === 'user' 
                ? 'bg-[#030307] border-violet-500/20 text-violet-50' 
                : (msg.isMock ? 'bg-[#050402] border-amber-500/10 text-amber-50' : 'bg-[#020205] border-white/10 text-gray-100')
            }`}
          >
            {msg.mode && (
              <div className={`absolute top-0 right-0 px-4 py-1.5 text-[9px] uppercase font-black tracking-widest border-l border-b ${
                msg.isMock ? 'bg-amber-600/10 text-amber-400 border-amber-500/20' : 'bg-violet-600/10 text-violet-400 border-white/5'
              }`}>
                {msg.mode}
              </div>
            )}
            
            <div className={`whitespace-pre-wrap text-[15px] leading-[1.8] font-normal tracking-wide prose prose-invert max-w-none ${msg.isMock ? 'opacity-80' : ''}`}>
              {msg.content}
            </div>

            {msg.groundingLinks && msg.groundingLinks.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.3em] flex items-center gap-3">
                  <span className={`w-1 h-1 ${msg.isMock ? 'bg-amber-500' : 'bg-violet-500'}`}></span>
                  {msg.isMock ? 'Cached Grounding Data:' : 'Verified Grounding Data:'}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {msg.groundingLinks.map((link, lIdx) => (
                    <a 
                      key={lIdx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group/link flex items-center gap-4 p-4 bg-black/40 border text-[11px] transition-all duration-300 ${
                        msg.isMock 
                        ? 'border-amber-500/10 text-amber-300 hover:border-amber-500/40' 
                        : 'border-white/5 text-violet-300 hover:border-violet-500/40'
                      }`}
                    >
                      <i className={`${link.source === 'maps' ? 'fas fa-location-crosshairs' : 'fas fa-link'} opacity-30 group-hover/link:opacity-100`}></i>
                      <span className="truncate font-black uppercase tracking-widest">{link.title || link.uri}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {isThinking && (
        <div className="flex flex-col items-start space-y-6">
          <div className="flex items-center gap-5">
            <span className="text-[11px] text-violet-400 font-black animate-pulse tracking-[0.5em]">ANALYZING_SYSTEM_V32...</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1 h-3 bg-violet-500/20 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
              ))}
            </div>
          </div>
          <div className="w-72 h-[1px] bg-gradient-to-r from-violet-600/50 to-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
