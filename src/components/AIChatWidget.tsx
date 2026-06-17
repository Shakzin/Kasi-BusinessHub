import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/providers/trpc";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Trash2,
  Sparkles,
} from "lucide-react";

function getSessionId() {
  let sid = localStorage.getItem("chat_session_id");
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("chat_session_id", sid);
  }
  return sid;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sessionId = useRef(getSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: history } = trpc.chat.history.useQuery(
    { sessionId: sessionId.current },
    { enabled: isOpen }
  );

  const sendMutation = trpc.chat.send.useMutation({
    onSuccess: () => {
      utils.chat.history.invalidate({ sessionId: sessionId.current });
    },
  });

  const clearMutation = trpc.chat.clear.useMutation({
    onSuccess: () => {
      utils.chat.history.invalidate({ sessionId: sessionId.current });
    },
  });

  const utils = trpc.useUtils();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMutation.mutate({
      sessionId: sessionId.current,
      message: message.trim(),
    });
    setMessage("");
  };

  const handleClear = () => {
    clearMutation.mutate({ sessionId: sessionId.current });
  };

  const messages = history || [];

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
          aria-label="Open AI Chat"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl border border-[#E7E5E4] flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E7E5E4]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C1917]">
                  AI Assistant
                </p>
                <p className="text-[10px] text-[#059669] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#A8A29E] hover:text-[#DC2626]"
                onClick={handleClear}
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#A8A29E] hover:text-[#1C1917]"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-[#4F46E5]" />
                </div>
                <p className="text-sm font-medium text-[#1C1917] mb-1">
                  Hello! I&apos;m your AI assistant
                </p>
                <p className="text-xs text-[#78716C] max-w-[280px] mx-auto">
                  Ask me anything about managing your businesses, creating
                  events, subscription plans, or navigating the platform.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-[#4F46E5] text-white"
                      : "bg-[#EEF2FF] text-[#4F46E5]"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </div>
                <div
                  className={`max-w-[280px] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#4F46E5] text-white rounded-tr-sm"
                      : "bg-[#F5F5F3] text-[#1C1917] rounded-tl-sm"
                  }`}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                    }}
                  />
                </div>
              </div>
            ))}

            {sendMutation.isPending && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-[#F5F5F3] px-3.5 py-2.5 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#A8A29E] animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-[#A8A29E] animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-[#A8A29E] animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 border-t border-[#E7E5E4] flex gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="border-[#E7E5E4] bg-[#FAFAF8] text-sm"
              disabled={sendMutation.isPending}
            />
            <Button
              type="submit"
              size="icon"
              className="bg-[#4F46E5] hover:bg-[#4338CA] shrink-0 h-10 w-10"
              disabled={sendMutation.isPending || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
