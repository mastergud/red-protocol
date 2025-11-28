"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Walkie-Talkie Interface
// AI Agent K communication system with audio support
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, X, Send, Volume2, VolumeX, Lightbulb, Flashlight } from "lucide-react";
import { useGameStore } from "@/src/store/gameStore";
import { getDay } from "@/src/data/gameContent";

// ═══════════════════════════════════════════════════════════════════════════════
// useAgentK Hook - Handles AI communication
// ═══════════════════════════════════════════════════════════════════════════════
function useAgentK() {
  const {
    currentDay,
    inventory,
    completedDays,
    addChatMessage,
    setAgentSpeaking,
    setProcessing,
    toggleUv,
    validateAnswer,
    completeDay,
    isUvLightActive,
  } = useGameStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play static sound effect
  const playStatic = useCallback(async (type: "start" | "end") => {
    try {
      const audio = new Audio(`/sounds/static_${type}.mp3`);
      audio.volume = 0.3;
      await audio.play();
    } catch (e) {
      console.log("Audio not available:", e);
    }
  }, []);

  // Send message to Agent K
  const sendMessage = useCallback(async (message: string) => {
    const dayData = getDay(currentDay);
    
    // Add user message to chat
    addChatMessage({ role: "user", content: message });
    setProcessing(true);

    // Check for special commands first
    const lowerMessage = message.toLowerCase();
    
    // UV Light toggle
    if (lowerMessage.includes("uv") || lowerMessage.includes("lumière") || lowerMessage.includes("ultraviolet")) {
      toggleUv();
      await playStatic("start");
      setAgentSpeaking(true);
      
      setTimeout(() => {
        addChatMessage({
          role: "agent",
          content: isUvLightActive 
            ? "UV light deactivated. Back to normal vision."
            : "UV light activated. Look for hidden markings, detective.",
        });
        setAgentSpeaking(false);
        setProcessing(false);
        playStatic("end");
      }, 1000);
      return;
    }

    // Try to validate as answer
    if (dayData?.solution) {
      const cleanAnswer = message.toUpperCase().replace(/\s/g, "");
      if (cleanAnswer === dayData.solution || message.includes(dayData.solution)) {
        await playStatic("start");
        setAgentSpeaking(true);
        
        setTimeout(() => {
          addChatMessage({
            role: "agent",
            content: `Excellent work, detective. "${dayData.solution}" is correct. Evidence secured. Day ${currentDay} complete.`,
          });
          completeDay(currentDay);
          setAgentSpeaking(false);
          setProcessing(false);
          playStatic("end");
        }, 1500);
        return;
      }
    }

    // Call AI API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          currentDay,
          inventory: inventory.map(i => i.name),
          completedDays,
          dayContext: dayData?.aiContext,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      
      await playStatic("start");
      setAgentSpeaking(true);

      // If TTS is available, play it
      if (data.audioUrl) {
        audioRef.current = new Audio(data.audioUrl);
        audioRef.current.onended = () => {
          setAgentSpeaking(false);
          playStatic("end");
        };
        await audioRef.current.play();
      }

      addChatMessage({ role: "agent", content: data.response });

      // Check if response triggers day completion
      if (data.completed) {
        completeDay(currentDay);
      }

      if (!data.audioUrl) {
        setTimeout(() => {
          setAgentSpeaking(false);
          playStatic("end");
        }, 1500);
      }

    } catch (error) {
      // Fallback response
      await playStatic("start");
      setAgentSpeaking(true);
      
      const fallbackResponses = [
        "Copy that. Keep investigating, detective.",
        "Interesting lead. What else have you found?",
        "The truth is in the details. Look closer.",
        "Stay sharp. This case has more layers.",
        `Day ${currentDay}: ${dayData?.hint || "Follow the evidence."}`,
      ];
      
      setTimeout(() => {
        addChatMessage({
          role: "agent",
          content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        });
        setAgentSpeaking(false);
        setProcessing(false);
        playStatic("end");
      }, 1000);
    }

    setProcessing(false);
  }, [currentDay, inventory, completedDays, addChatMessage, setAgentSpeaking, setProcessing, toggleUv, completeDay, isUvLightActive, playStatic]);

  return { sendMessage };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Chat Message Component
// ═══════════════════════════════════════════════════════════════════════════════
function ChatMessage({ message }: { message: { role: string; content: string; timestamp: Date } }) {
  const isAgent = message.role === "agent";

  return (
    <motion.div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-2`}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`max-w-[85%] px-3 py-2 rounded-lg font-mono text-sm
          ${isAgent 
            ? "bg-zinc-800 text-amber-100 border-l-2 border-amber-600" 
            : "bg-amber-900/30 text-zinc-200 border-r-2 border-zinc-600"
          }`}
      >
        {isAgent && (
          <span className="text-[10px] text-amber-500 font-bold block mb-1">
            AGENT K
          </span>
        )}
        <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <span className="text-[9px] text-zinc-500 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Quick Actions Bar
// ═══════════════════════════════════════════════════════════════════════════════
function QuickActions({ onAction }: { onAction: (action: string) => void }) {
  const { isUvLightActive } = useGameStore();

  return (
    <div className="flex gap-2 p-2 border-t border-zinc-700 bg-zinc-900/50">
      <button
        onClick={() => onAction("uv")}
        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
          ${isUvLightActive 
            ? "bg-purple-600 text-white" 
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          } transition-colors`}
      >
        <Lightbulb size={12} />
        UV {isUvLightActive ? "ON" : "OFF"}
      </button>
      <button
        onClick={() => onAction("hint")}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
          bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
      >
        💡 Hint
      </button>
      <button
        onClick={() => onAction("status")}
        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
          bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
      >
        📋 Status
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Walkie-Talkie Component
// ═══════════════════════════════════════════════════════════════════════════════
export function WalkieTalkie() {
  const {
    isWalkieTalkieOpen,
    toggleWalkie,
    chatHistory,
    isAgentSpeaking,
    isProcessing,
    isMuted,
    toggleMute,
    currentDay,
  } = useGameStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useAgentK();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Focus input when opened
  useEffect(() => {
    if (isWalkieTalkieOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isWalkieTalkieOpen]);

  // Welcome message on first open
  useEffect(() => {
    if (isWalkieTalkieOpen && chatHistory.length === 0) {
      const dayData = getDay(currentDay);
      useGameStore.getState().addChatMessage({
        role: "agent",
        content: `*KSSHHH* Agent K online. Day ${currentDay}: "${dayData?.title}". 
${dayData?.description?.split('\n')[0] || ""}

What do you need, detective?`,
      });
    }
  }, [isWalkieTalkieOpen, chatHistory.length, currentDay]);

  // Handle submit
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "uv":
        sendMessage("Toggle UV light");
        break;
      case "hint":
        sendMessage("I need a hint");
        break;
      case "status":
        sendMessage("What's my current status?");
        break;
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-xl
          flex items-center justify-center
          ${isWalkieTalkieOpen 
            ? "bg-zinc-800 border-2 border-zinc-600" 
            : "bg-amber-700 hover:bg-amber-600 border-2 border-amber-500"
          } transition-all`}
        onClick={toggleWalkie}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isWalkieTalkieOpen ? (
          <X className="w-6 h-6 text-zinc-300" />
        ) : (
          <Radio className="w-6 h-6 text-white" />
        )}
        
        {/* LED Indicator */}
        <motion.div
          className={`absolute top-1 right-1 w-3 h-3 rounded-full
            ${isAgentSpeaking ? "bg-red-500" : "bg-green-500"}`}
          animate={isAgentSpeaking ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </motion.button>

      {/* Walkie-Talkie Panel */}
      <AnimatePresence>
        {isWalkieTalkieOpen && (
          <motion.div
            className="fixed bottom-28 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]
              bg-zinc-900 rounded-xl border-2 border-zinc-700 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header - Walkie-Talkie Top */}
            <div className="bg-zinc-800 px-4 py-3 border-b-2 border-zinc-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Antenna */}
                  <div className="relative">
                    <div className="w-1 h-8 bg-zinc-600 rounded-full" />
                    <motion.div
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 font-mono tracking-wider">
                      AGENT K
                    </h3>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      FREQ: 147.520 MHz • {isAgentSpeaking ? "TRANSMITTING" : "STANDBY"}
                    </p>
                  </div>
                </div>

                {/* Mute button */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-zinc-300" />
                  )}
                </button>
              </div>

              {/* Signal strength bars */}
              <div className="flex gap-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <motion.div
                    key={bar}
                    className={`w-2 bg-amber-500 rounded-sm`}
                    style={{ height: bar * 3 + 4 }}
                    animate={{ opacity: isAgentSpeaking ? [0.3, 1, 0.3] : 1 }}
                    transition={{ duration: 0.3, delay: bar * 0.1, repeat: isAgentSpeaking ? Infinity : 0 }}
                  />
                ))}
              </div>
            </div>

            {/* Chat Display - Terminal Style */}
            <div 
              className="h-72 overflow-y-auto p-3 bg-zinc-950 font-mono"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0,0,0,0.1) 2px,
                  rgba(0,0,0,0.1) 4px
                )`,
              }}
            >
              {chatHistory.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isProcessing && (
                <motion.div
                  className="flex items-center gap-2 text-amber-500/70 text-sm font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      >
                        ●
                      </motion.span>
                    ))}
                  </span>
                  <span className="text-xs">PROCESSING...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Input - Push-to-Talk Style */}
            <form onSubmit={handleSubmit} className="p-3 bg-zinc-800 border-t border-zinc-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type message or answer..."
                  disabled={isProcessing}
                  className="flex-1 bg-zinc-900 text-amber-100 text-sm px-4 py-2 rounded-lg
                    border border-zinc-700 focus:border-amber-500 focus:outline-none
                    placeholder:text-zinc-600 font-mono disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!inputValue.trim() || isProcessing}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 disabled:bg-zinc-700
                    disabled:text-zinc-500 text-white rounded-lg transition-colors font-mono text-sm"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              
              {/* PTT Hint */}
              <p className="text-[10px] text-zinc-600 text-center mt-2 font-mono">
                PRESS ENTER TO TRANSMIT
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default WalkieTalkie;

