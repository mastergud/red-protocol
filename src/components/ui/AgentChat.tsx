"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Agent K Chat Interface
// AI Assistant for investigation guidance and puzzle hints
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Lightbulb, Flashlight } from "lucide-react";
import { useGameStore, selectCurrentDayData } from "@/src/store/gameStore";
import { ChatMessage } from "@/src/types/game.types";
import { getDayData } from "@/src/data/gameData";

// ═══════════════════════════════════════════════════════════════════════════════
// Mock AI Response System
// ═══════════════════════════════════════════════════════════════════════════════
function generateAgentResponse(
  message: string,
  currentDay: number,
  actions: {
    toggleUvLight: () => void;
    validateAnswer: (day: number, answer: string) => boolean;
    getNextHint: (day: number) => string | null;
  }
): { response: string; action?: ChatMessage["action"] } {
  const lowerMessage = message.toLowerCase().trim();
  const dayData = getDayData(currentDay);

  // UV Light commands
  if (
    lowerMessage.includes("uv") ||
    lowerMessage.includes("ultraviolet") ||
    lowerMessage.includes("light") ||
    lowerMessage.includes("lumière")
  ) {
    actions.toggleUvLight();
    return {
      response:
        "UV light toggled. Some secrets only reveal themselves under ultraviolet illumination. Look carefully at any documents or surfaces.",
      action: { type: "TOGGLE_UV" },
    };
  }

  // Hint requests
  if (
    lowerMessage.includes("hint") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("indice") ||
    lowerMessage.includes("aide") ||
    lowerMessage.includes("stuck") ||
    lowerMessage.includes("bloqué")
  ) {
    const hint = actions.getNextHint(currentDay);
    if (hint) {
      return {
        response: `Here's what I can tell you: ${hint}`,
        action: { type: "GIVE_HINT" },
      };
    }
    return {
      response:
        "I've given you all the hints I can for this puzzle. Trust your instincts, detective.",
    };
  }

  // Solution validation attempts (check if message contains potential answers)
  if (dayData?.solution) {
    // Check for exact solution match
    if (lowerMessage.includes(dayData.solution.toLowerCase())) {
      const isCorrect = actions.validateAnswer(currentDay, dayData.solution);
      if (isCorrect) {
        return {
          response: `Excellent work, detective. "${dayData.solution}" is correct. Evidence secured. You've unlocked the next day of investigation.`,
          action: { type: "VALIDATE_PUZZLE", payload: { correct: true } },
        };
      }
    }

    // Day-specific responses
    switch (currentDay) {
      case 1:
        if (lowerMessage.includes("vial") || lowerMessage.includes("blue") || lowerMessage.includes("fiole")) {
          return {
            response:
              "You're on the right track. The blue vial is hidden in the crash debris. Look near the overturned crates, where the snow meets the shadows.",
          };
        }
        break;

      case 2:
        if (lowerMessage.includes("finger") || lowerMessage.includes("hand") || lowerMessage.includes("doigt")) {
          return {
            response:
              "Count the fingers on the handprint carefully. Something's missing. That's our first clue about who we're looking for.",
          };
        }
        if (lowerMessage.includes("scratch") || lowerMessage.includes("gratter")) {
          return {
            response:
              "Use your cursor to scratch away the frost. Move it back and forth over the frozen surface to reveal what's beneath.",
          };
        }
        break;

      case 3:
        if (lowerMessage.includes("sector") || lowerMessage.includes("secteur")) {
          const isCorrect = actions.validateAnswer(3, "SECTOR 9");
          if (isCorrect) {
            return {
              response:
                "Sector 9. An industrial zone on the outskirts. Officially decommissioned in '89. Unofficially... well, that's what we're here to find out.",
              action: { type: "VALIDATE_PUZZLE", payload: { correct: true } },
            };
          }
        }
        if (lowerMessage.includes("map") || lowerMessage.includes("carte") || lowerMessage.includes("piece")) {
          return {
            response:
              "Drag the map pieces to reassemble them. Look for matching edges—roads and contours should align between pieces.",
          };
        }
        break;

      case 4:
        if (/\d{4}/.test(lowerMessage)) {
          const numbers = lowerMessage.match(/\d{4}/)?.[0];
          if (numbers === "8821") {
            const isCorrect = actions.validateAnswer(4, "8821");
            if (isCorrect) {
              return {
                response:
                  "8821. A code, but for what? Keep it noted. We'll need it later.",
                action: { type: "VALIDATE_PUZZLE", payload: { correct: true } },
              };
            }
          }
          return {
            response: `${numbers}? That's not what I'm seeing under the UV light. Look again.`,
          };
        }
        break;

      case 5:
        if (lowerMessage.includes("94.5") || lowerMessage.includes("94,5")) {
          const isCorrect = actions.validateAnswer(5, "94.5");
          if (isCorrect) {
            return {
              response:
                "94.5 FM. The numbers station. Cold War relic... or so they told us. Someone's still broadcasting coordinates. Sector 9 coordinates.",
              action: { type: "VALIDATE_PUZZLE", payload: { correct: true } },
            };
          }
        }
        if (lowerMessage.includes("radio") || lowerMessage.includes("frequency") || lowerMessage.includes("fréquence")) {
          return {
            response:
              "Tune the dial slowly. You're looking for a clear voice signal hidden in the static. The frequency is somewhere between 90 and 100 FM.",
          };
        }
        break;
    }
  }

  // Generic investigation responses
  const genericResponses = [
    "Interesting theory, detective. Keep investigating.",
    "Every detail matters in this case. What else have you noticed?",
    "The truth is here somewhere. We just need to find it.",
    "Stay focused. The answer is closer than you think.",
    "Trust the evidence. It never lies.",
    "This case has more layers than a Russian nesting doll. Keep digging.",
  ];

  return {
    response: genericResponses[Math.floor(Math.random() * genericResponses.length)],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Chat Message Component
// ═══════════════════════════════════════════════════════════════════════════════
function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.sender === "agent";

  return (
    <motion.div
      className={`flex ${isAgent ? "justify-start" : "justify-end"} mb-3`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isAgent
            ? "bg-slate-800 text-slate-200 rounded-tl-none"
            : "bg-red-900/50 text-slate-200 rounded-tr-none"
        }`}
      >
        {isAgent && (
          <p className="text-[10px] text-red-500 font-bold mb-1 uppercase tracking-wider">
            Agent K
          </p>
        )}
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className="text-[9px] text-slate-600 mt-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Quick Action Buttons
// ═══════════════════════════════════════════════════════════════════════════════
function QuickActions({
  onAction,
}: {
  onAction: (action: string) => void;
}) {
  const actions = [
    { label: "💡 Hint", action: "hint" },
    { label: "🔦 UV Light", action: "uv" },
  ];

  return (
    <div className="flex gap-2 mb-3 px-2">
      {actions.map(({ label, action }) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 
            text-slate-400 rounded-full transition-colors border border-slate-700"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Agent Chat Component
// ═══════════════════════════════════════════════════════════════════════════════
export function AgentChat() {
  const {
    isChatOpen,
    toggleChat,
    chatMessages,
    addChatMessage,
    currentDay,
    toggleUvLight,
    validateAnswer,
    getNextHint,
  } = useGameStore();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  // Send initial greeting on first open
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      const dayData = getDayData(currentDay);
      addChatMessage({
        sender: "agent",
        content: `Day ${currentDay}: "${dayData?.title}". ${
          dayData?.type === "UV_LIGHT"
            ? 'I\'ve equipped you with a UV light. Type "UV" to toggle it.'
            : "I'm here to assist your investigation."
        } Ask me for hints if you get stuck.`,
      });
    }
  }, [isChatOpen, chatMessages.length, currentDay, addChatMessage]);

  // Handle message submission
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!inputValue.trim()) return;

      // Add user message
      addChatMessage({
        sender: "user",
        content: inputValue,
      });

      const userMessage = inputValue;
      setInputValue("");
      setIsTyping(true);

      // Simulate AI thinking delay
      setTimeout(() => {
        const { response, action } = generateAgentResponse(userMessage, currentDay, {
          toggleUvLight,
          validateAnswer,
          getNextHint,
        });

        addChatMessage({
          sender: "agent",
          content: response,
          action,
        });
        setIsTyping(false);
      }, 500 + Math.random() * 1000);
    },
    [inputValue, currentDay, addChatMessage, toggleUvLight, validateAnswer, getNextHint]
  );

  // Handle quick actions
  const handleQuickAction = useCallback(
    (action: string) => {
      setInputValue(action);
      setTimeout(() => handleSubmit(), 100);
    },
    [handleSubmit]
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
          flex items-center justify-center shadow-lg
          ${isChatOpen ? "bg-slate-800" : "bg-red-600 hover:bg-red-700"}
          transition-colors`}
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isChatOpen ? (
          <X className="w-6 h-6 text-slate-300" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]
              bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-red-900/50 flex items-center justify-center">
                    <span className="text-lg">🕵️</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Agent K</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                    Investigation Assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-1">
              {chatMessages.map((message) => (
                <ChatMessageBubble key={message.id} message={message} />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  className="flex items-center gap-2 text-slate-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="flex gap-1">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                    >
                      ●
                    </motion.span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                    >
                      ●
                    </motion.span>
                  </span>
                  <span className="text-xs">Agent K is typing...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <QuickActions onAction={handleQuickAction} />

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-slate-800 bg-slate-950"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-800 text-slate-200 text-sm px-4 py-2 rounded-lg
                    border border-slate-700 focus:border-red-500 focus:outline-none
                    placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-800
                    disabled:text-slate-600 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AgentChat;

