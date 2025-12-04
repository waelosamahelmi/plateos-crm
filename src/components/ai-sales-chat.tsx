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
        "Hei! 👋 Olen PlateOS:n myyntiassistentti. Autan sinua löytämään täydellisen ravintolaratkaisun. Mitä haluaisit tietää PlateOS:sta?",
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
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "PlateOS Demo",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                role: "system",
                content: `Olet PlateOS-ravintolajärjestelmän myyntiassistentti. Tehtäväsi on auttaa potentiaalisia asiakkaita ymmärtämään PlateOS:n edut ja ohjata heidät tilaamaan järjestelmä.

TUOTTEEN TIEDOT:
- Nimi: PlateOS
- Hinta: 1500€ kertamaksu
- Hosting: Ilmainen ensimmäisen vuoden, sen jälkeen 10€/kk
- Käyttöönotto: 7 päivää tilauksesta

OMINAISUUDET:
1. Modernin verkkosivusto (responsiivinen, toimii kaikilla laitteilla)
2. Android-mobiilisovellus asiakkaille
3. Täydellinen admin-hallintapaneeli
4. Verkkokauppa-toiminnot (tilausten vastaanotto)
5. Stripe-maksuintegraatio
6. Menu- ja hintojen hallinta
7. Tilausten hallinta reaaliajassa
8. Reaaliaikaiset ilmoitukset uusista tilauksista
9. Varaston hallinta
10. Analytiikka ja raportit

EDUT:
- Lisää verkkomyyntiä 40% keskimäärin
- Helpottaa tilaustenhallintaa
- Vähentää puhelinmyyntiä
- Modernisoi ravintolan brändiä
- Asiakkaat voivat tilata 24/7

TAKUU:
- 30 päivän rahat takaisin -takuu

VASTAA AINA SUOMEKSI. Ole ystävällinen, innostunut ja auta asiakasta ymmärtämään miten PlateOS voi auttaa heidän ravintolaansa. Kysy asiakkaan tarpeista ja vastaa niiden mukaan. Jos asiakas on valmis tilaamaan, kehota häntä antamaan yhteystiedot.`,
              },
              ...messages,
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || "Anteeksi, tapahtui virhe. Yritä uudelleen.";

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
            "Anteeksi, en pysty vastaamaan juuri nyt. Ota yhteyttä suoraan: info@plateos.fi tai soita +358 40 123 4567",
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
    "Mitä PlateOS maksaa?",
    "Miten se toimii?",
    "Mitä ominaisuuksia siinä on?",
    "Kuinka kauan käyttöönotto kestää?",
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
