import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AISalesChatProps {
  onClose: () => void;
}

export function AISalesChat({ onClose }: AISalesChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hei! 👋 Olen PlateOS:n myyntiassistentti.\n\nHello! 👋 I'm the PlateOS sales assistant.\n\nMerhaba! 👋 Ben PlateOS satış asistanıyım.\n\nمرحباً! 👋 أنا مساعد مبيعات PlateOS.\n\nHow can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      console.log("API Key available:", !!apiKey, apiKey ? `${apiKey.substring(0, 10)}...` : "none");
      
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "PlateOS Demo",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                role: "system",
                content: `You are a multilingual sales assistant for PlateOS restaurant management system. 

CRITICAL: ALWAYS respond in the SAME LANGUAGE the customer writes in. You MUST support:
- Finnish (Suomi)
- English
- Arabic (العربية) 
- Turkish (Türkçe)
- Any other language the customer uses

PRODUCT INFORMATION:
- Name: PlateOS
- Price: €1500 one-time setup fee
- Hosting: Free first year, then €10/month
- Deployment: 7 days from order

FEATURES:
1. Modern responsive website (works on all devices)
2. Android mobile app for customers
3. Complete admin dashboard
4. E-commerce features (order receiving)
5. Stripe payment integration
6. Menu and price management
7. Real-time order management
8. Real-time notifications for new orders
9. Inventory management
10. Analytics and reports

BENEFITS:
- Increases online sales by 40% on average
- Simplifies order management
- Reduces phone orders
- Modernizes restaurant brand
- Customers can order 24/7

GUARANTEE:
- 30-day money-back guarantee

CONTACT:
- Email: info@plateos.fi
- Website: plateos.fi

Be friendly, enthusiastic, and help the customer understand how PlateOS can help their restaurant. Ask about their needs and respond accordingly. If the customer is ready to order, encourage them to provide their contact details or visit plateos.fi/register.

Remember: ALWAYS reply in the customer's language!`,
              },
              ...messages,
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || "Sorry, an error occurred. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I can't respond right now. Please contact us directly:\n\n📧 info@plateos.fi\n🌐 plateos.fi",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "What does PlateOS cost?",
    "Mitä PlateOS maksaa?",
    "PlateOS ne kadar?",
    "كم سعر PlateOS؟",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-600 to-orange-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-white">PlateOS Myyntiassistentti</h3>
              <p className="text-xs text-white/80 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Paikalla
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : "bg-gradient-to-r from-red-600 to-orange-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-red-600 to-orange-600">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-red-600" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
              Yleisiä kysymyksiä:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 text-left justify-start hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-700"
                  onClick={() => setInput(question)}
                >
                  <Sparkles className="w-3 h-3 mr-1.5 flex-shrink-0" />
                  <span className="truncate">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Kirjoita viestisi..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="gradient-primary text-white"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Powered by OpenRouter AI
          </p>
        </div>
      </Card>
    </div>
  );
}
