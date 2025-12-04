import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Send, Bot, User, Loader2, MessageCircle, Minimize2 } from "lucide-react";
import { saveChatMessage, createChatSession, submitRegistration } from "@/lib/supabase";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface RegistrationData {
  restaurant_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  restaurant_type?: string;
  menu_description?: string;
  has_delivery?: boolean;
  has_pickup?: boolean;
  has_dine_in?: boolean;
}

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hei! 👋 Olen PlateOS:n avustaja. Voin auttaa sinua ymmärtämään palveluitamme, vastata kysymyksiisi tai auttaa rekisteröimään ravintolasi. Miten voin auttaa?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [collectedData, setCollectedData] = useState<RegistrationData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        const session = await createChatSession(
          `visitor_${Date.now()}`,
          { source: 'widget', userAgent: navigator.userAgent }
        );
        if (session) {
          setSessionId(session.id);
        }
      } catch (error) {
        console.error('Error creating chat session:', error);
      }
    };
    
    if (isOpen && !sessionId) {
      initSession();
    }
  }, [isOpen, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save message to database
  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    if (!sessionId) {
      console.warn('Cannot save message: No session ID');
      return;
    }
    try {
      const saved = await saveChatMessage(sessionId, role, content, { collectedData });
      if (saved) {
        console.log('Message saved successfully:', saved.id);
      } else {
        console.error('Failed to save message');
      }
    } catch (error) {
      console.error('Error in saveMessage:', error);
    }
  };

  // Extract registration data from conversation
  const extractRegistrationData = (text: string, existingData: RegistrationData): RegistrationData => {
    const data = { ...existingData };
    
    // Email pattern
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) data.email = emailMatch[0];
    
    // Phone pattern (Finnish format)
    const phoneMatch = text.match(/(\+358|0)\s*\d{2,3}\s*\d{3,4}\s*\d{3,4}/);
    if (phoneMatch) data.phone = phoneMatch[0].replace(/\s/g, '');
    
    // Website pattern
    const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w-]+\.\w{2,}/gi);
    if (websiteMatch) data.website = websiteMatch[0];
    
    return data;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Ensure we have a session before sending
    if (!sessionId) {
      console.error('No session ID available');
      return;
    }

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    // Save user message immediately
    try {
      await saveMessage('user', userMessage);
    } catch (err) {
      console.error('Error saving user message:', err);
    }
    
    setIsLoading(true);

    // Extract any registration data from user message
    const newCollectedData = extractRegistrationData(userMessage, collectedData);
    setCollectedData(newCollectedData);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "PlateOS Sales",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                role: "system",
                content: `You are a sales assistant and registration helper for PlateOS restaurant system. You can communicate in BOTH FINNISH AND ENGLISH - respond in the language the customer uses. Your tasks are:
1. Help potential customers understand PlateOS benefits
2. Answer questions about the service
3. IMPORTANT: Collect restaurant information for registration when customer shows interest

PRODUCT INFORMATION:
- Name: PlateOS
- Price: €1500 one-time setup fee
- Hosting: Free first year, then €10/month
- Deployment: 7 days from order

FEATURES:
- Modern website + Android app
- Complete admin dashboard
- Online ordering and order management
- Stripe payment integration
- Real-time notifications
- Analytics and reports

REGISTRATION DATA COLLECTION:
If customer wants to order or register, ask these details ONE AT A TIME in a friendly way:
1. Restaurant name
2. Contact person name
3. Email address
4. Phone number
5. Restaurant address and city
6. Restaurant type (pizza, kebab, sushi, etc.)
7. Brief menu description
8. Do you offer: pickup, delivery, dine-in?

COLLECTED DATA SO FAR:
${JSON.stringify(collectedData, null, 2)}

When all data is collected, tell the customer that registration has been submitted and we'll contact them within 24 hours.
At the end, respond EXACTLY with: [REGISTRATION_COMPLETE] if all data has been collected.

ALWAYS RESPOND IN THE SAME LANGUAGE THE CUSTOMER USES (Finnish or English). Be friendly and professional. Don't ask all questions at once - have a natural conversation.`,
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      let assistantMessage = data.choices[0]?.message?.content || "Anteeksi, tapahtui virhe. Yritä uudelleen.";

      // Check if registration is complete
      if (assistantMessage.includes('[REGISTRATION_COMPLETE]')) {
        assistantMessage = assistantMessage.replace('[REGISTRATION_COMPLETE]', '');
        
        // Submit registration if we have enough data
        if (collectedData.restaurant_name && collectedData.email && collectedData.phone) {
          try {
            await submitRegistration({
              restaurant_name: collectedData.restaurant_name || '',
              contact_name: collectedData.contact_name || '',
              email: collectedData.email || '',
              phone: collectedData.phone || '',
              website: collectedData.website,
              address: collectedData.address || '',
              city: collectedData.city || '',
              postal_code: collectedData.postal_code || '',
              restaurant_type: collectedData.restaurant_type || '',
              menu_description: collectedData.menu_description || '',
              has_delivery: collectedData.has_delivery || false,
              has_pickup: collectedData.has_pickup || false,
              has_dine_in: collectedData.has_dine_in || false,
              source: 'ai_chat',
            });
          } catch (err) {
            console.error('Error submitting registration:', err);
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
      await saveMessage('assistant', assistantMessage);
    } catch (error) {
      console.error("Error calling OpenRouter:", error);
      const errorMessage = "Anteeksi, en pysty vastaamaan juuri nyt. Ota yhteyttä suoraan: info@plateos.fi";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
      await saveMessage('assistant', errorMessage);
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
    "Mitä PlateOS maksaa?",
    "Haluan rekisteröidä ravintolani",
    "Miten pääsen alkuun?",
  ];

  // Floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl hover:shadow-orange-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Avaa chat"
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl hover:shadow-orange-500/30 transition-all"
        >
          <Bot className="w-5 h-5" />
          <span className="font-medium">PlateOS Chat</span>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </button>
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Full chat widget
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]">
      <Card className="flex flex-col h-[500px] max-h-[80vh] shadow-2xl border-0 overflow-hidden bg-[#0a0a0a] border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">PlateOS</h3>
              <p className="text-xs text-white/80 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : "bg-gradient-to-r from-orange-500 to-red-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-white border border-white/10"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Kirjoita viestisi..."
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-orange-500/50"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-white/30 mt-2 text-center">
            Powered by PlateOS AI
          </p>
        </div>
      </Card>
    </div>
  );
}
