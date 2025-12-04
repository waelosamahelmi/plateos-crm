import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  supabase, 
  getChatSessions, 
  getChatMessages, 
  getContactSubmissions, 
  getRegistrations,
  updateRegistrationStatus
} from "@/lib/supabase";
import { Link } from "wouter";
import {
  MessageSquare,
  Users,
  Store,
  Mail,
  Phone,
  Calendar,
  Eye,
  Loader2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Copy,
  Download
} from "lucide-react";

interface ChatSession {
  id: string;
  visitor_id: string | null;
  status: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  chat_messages: { count: number }[];
}

interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: 'contact' | 'complaint' | 'support';
  status: string;
  created_at: string;
}

interface Registration {
  id: string;
  restaurant_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string | null;
  address: string;
  city: string;
  postal_code: string;
  restaurant_type: string;
  current_system: string | null;
  menu_description: string;
  menu_items_count: number | null;
  has_delivery: boolean;
  has_pickup: boolean;
  has_dine_in: boolean;
  opening_hours: string | null;
  special_requirements: string | null;
  preferred_colors: string | null;
  timeline: string | null;
  source: string | null;
  status: string;
  admin_notes: string | null;
  claude_md: string | null;
  created_at: string;
}

export default function PlateOSPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [, setSelectedRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedClaudeMd, setGeneratedClaudeMd] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Simple password auth (in production, use proper auth)
  const handleLogin = () => {
    if (password === 'PlateOS2024!') {
      setIsAuthenticated(true);
      localStorage.setItem('plateos_admin', 'true');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('plateos_admin') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chats, contacts, regs] = await Promise.all([
        getChatSessions({ limit: 50 }),
        getContactSubmissions({ limit: 50 }),
        getRegistrations({ limit: 50 })
      ]);
      setChatSessions(chats);
      setContactSubmissions(contacts);
      setRegistrations(regs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatMessages = async (sessionId: string) => {
    setSelectedChat(sessionId);
    const messages = await getChatMessages(sessionId);
    setChatMessages(messages);
  };

  const generateClaudeMd = async (registration: Registration) => {
    setIsGenerating(true);
    
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "PlateOS Admin",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [
              {
                role: "system",
                content: `You are an expert developer assistant. Generate a CLAUDE.md file that will guide the migration/customization of the babylon-web and babylon-app codebase to create a new restaurant system.

The CLAUDE.md should include:
1. Project Overview - Brief description of the new restaurant
2. Branding Guidelines - Colors, fonts, style preferences
3. Configuration Changes - What needs to be modified in the config files
4. Database Schema - Any custom fields or modifications needed
5. Menu Structure - Categories and sample items based on restaurant type
6. Feature Toggles - Which features to enable/disable
7. Styling Guidelines - CSS variables and theme modifications
8. Stock Images - Suggestions for placeholder images that match the restaurant type
9. Testing Checklist - Things to verify after migration

Format the output as a proper Markdown file that Claude can use as context for the migration task.`
              },
              {
                role: "user",
                content: `Generate a CLAUDE.md migration guide for this restaurant:

Restaurant Name: ${registration.restaurant_name}
Type: ${registration.restaurant_type}
Contact: ${registration.contact_name}
Location: ${registration.address}, ${registration.city} ${registration.postal_code}

Services:
- Delivery: ${registration.has_delivery ? 'Yes' : 'No'}
- Pickup: ${registration.has_pickup ? 'Yes' : 'No'}
- Dine-in: ${registration.has_dine_in ? 'Yes' : 'No'}

Menu Description: ${registration.menu_description}
Menu Items Count: ${registration.menu_items_count || 'Not specified'}
Current System: ${registration.current_system || 'None'}
Opening Hours: ${registration.opening_hours || 'Not specified'}

Branding Preferences: ${registration.preferred_colors || 'Not specified'}
Special Requirements: ${registration.special_requirements || 'None'}
Website: ${registration.website || 'None'}

Generate a comprehensive CLAUDE.md that will help migrate babylon-web and babylon-app to this new restaurant while maintaining the same feel but with unique styling elements.`
              }
            ],
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      const claudeMd = data.choices[0]?.message?.content || '';
      setGeneratedClaudeMd(claudeMd);
      
      // Save to database
      await (supabase
        .from('restaurant_registrations') as any)
        .update({ claude_md: claudeMd })
        .eq('id', registration.id);
        
    } catch (error) {
      console.error('Error generating CLAUDE.md:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadClaudeMd = (registration: Registration) => {
    const content = generatedClaudeMd || registration.claude_md || '';
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CLAUDE_${registration.restaurant_name.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'reviewing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fi-FI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 bg-white/5 border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-2xl text-white mx-auto mb-4">
              P
            </div>
            <h1 className="text-2xl font-bold text-white">PlateOS Portal</h1>
            <p className="text-white/60 mt-2">Kirjaudu sisään hallintapaneeliin</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Salasana"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              Kirjaudu
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-black text-lg">
                P
              </div>
              <div>
                <span className="text-xl font-bold">PlateOS Portal</span>
                <p className="text-xs text-white/50">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Päivitä
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem('plateos_admin');
                setIsAuthenticated(false);
              }}
              className="text-white/70 hover:text-white"
            >
              Kirjaudu ulos
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{chatSessions.length}</div>
                <div className="text-xs text-white/50">Keskustelua</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Store className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{registrations.length}</div>
                <div className="text-xs text-white/50">Rekisteröintiä</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{contactSubmissions.length}</div>
                <div className="text-xs text-white/50">Yhteydenottoa</div>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white/5 border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {registrations.filter(r => r.status === 'new').length}
                </div>
                <div className="text-xs text-white/50">Uutta pyyntöä</div>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="registrations" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="registrations" className="data-[state=active]:bg-white/10">
              <Store className="w-4 h-4 mr-2" />
              Rekisteröinnit
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/10">
              <Mail className="w-4 h-4 mr-2" />
              Yhteydenotot
            </TabsTrigger>
            <TabsTrigger value="chats" className="data-[state=active]:bg-white/10">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat-keskustelut
            </TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations">
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <Card className="p-12 bg-white/5 border-white/10 text-center">
                  <Store className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Ei rekisteröintejä vielä</p>
                </Card>
              ) : (
                registrations.map((reg) => (
                  <Card key={reg.id} className="p-6 bg-white/5 border-white/10 hover:bg-white/[0.07] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{reg.restaurant_name}</h3>
                          <Badge className={getStatusColor(reg.status)}>
                            {reg.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {reg.contact_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {reg.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {reg.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(reg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-white/40 mt-2">
                          {reg.restaurant_type} • {reg.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedRegistration(reg)}
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Näytä
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border-white/10">
                            <DialogHeader>
                              <DialogTitle className="text-white flex items-center gap-2">
                                <Store className="w-5 h-5" />
                                {reg.restaurant_name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                              {/* Status Update */}
                              <div className="flex items-center gap-4">
                                <Select
                                  value={reg.status}
                                  onValueChange={async (value) => {
                                    await updateRegistrationStatus(reg.id, value as any);
                                    loadData();
                                  }}
                                >
                                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Uusi</SelectItem>
                                    <SelectItem value="reviewing">Käsittelyssä</SelectItem>
                                    <SelectItem value="approved">Hyväksytty</SelectItem>
                                    <SelectItem value="rejected">Hylätty</SelectItem>
                                    <SelectItem value="completed">Valmis</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Details Grid */}
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-white border-b border-white/10 pb-2">Yhteystiedot</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-white/50">Nimi:</span> <span className="text-white">{reg.contact_name}</span></p>
                                    <p><span className="text-white/50">Email:</span> <span className="text-white">{reg.email}</span></p>
                                    <p><span className="text-white/50">Puhelin:</span> <span className="text-white">{reg.phone}</span></p>
                                    {reg.website && <p><span className="text-white/50">Verkkosivut:</span> <a href={reg.website} target="_blank" className="text-orange-400 hover:underline">{reg.website}</a></p>}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-white border-b border-white/10 pb-2">Sijainti</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-white/50">Osoite:</span> <span className="text-white">{reg.address}</span></p>
                                    <p><span className="text-white/50">Kaupunki:</span> <span className="text-white">{reg.city}</span></p>
                                    <p><span className="text-white/50">Postinumero:</span> <span className="text-white">{reg.postal_code}</span></p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-white border-b border-white/10 pb-2">Palvelut</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-white/50">Tyyppi:</span> <span className="text-white">{reg.restaurant_type}</span></p>
                                    <p><span className="text-white/50">Nouto:</span> <span className="text-white">{reg.has_pickup ? 'Kyllä' : 'Ei'}</span></p>
                                    <p><span className="text-white/50">Kuljetus:</span> <span className="text-white">{reg.has_delivery ? 'Kyllä' : 'Ei'}</span></p>
                                    <p><span className="text-white/50">Paikan päällä:</span> <span className="text-white">{reg.has_dine_in ? 'Kyllä' : 'Ei'}</span></p>
                                    {reg.opening_hours && <p><span className="text-white/50">Aukioloajat:</span> <span className="text-white">{reg.opening_hours}</span></p>}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-white border-b border-white/10 pb-2">Lisätiedot</h4>
                                  <div className="space-y-2 text-sm">
                                    {reg.current_system && <p><span className="text-white/50">Nykyinen järjestelmä:</span> <span className="text-white">{reg.current_system}</span></p>}
                                    {reg.preferred_colors && <p><span className="text-white/50">Väritoiveet:</span> <span className="text-white">{reg.preferred_colors}</span></p>}
                                    {reg.timeline && <p><span className="text-white/50">Aikataulu:</span> <span className="text-white">{reg.timeline}</span></p>}
                                    {reg.source && <p><span className="text-white/50">Lähde:</span> <span className="text-white">{reg.source}</span></p>}
                                  </div>
                                </div>
                              </div>

                              {/* Menu Description */}
                              <div className="space-y-2">
                                <h4 className="font-semibold text-white border-b border-white/10 pb-2">Menu kuvaus</h4>
                                <p className="text-white/70 text-sm">{reg.menu_description}</p>
                                {reg.menu_items_count && <p className="text-white/50 text-sm">Arvioitu tuotemäärä: {reg.menu_items_count}</p>}
                              </div>

                              {/* Special Requirements */}
                              {reg.special_requirements && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-white border-b border-white/10 pb-2">Erityistoiveet</h4>
                                  <p className="text-white/70 text-sm">{reg.special_requirements}</p>
                                </div>
                              )}

                              {/* CLAUDE.md Generator */}
                              <div className="space-y-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-white flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-orange-400" />
                                    CLAUDE.md Generator
                                  </h4>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => generateClaudeMd(reg)}
                                      disabled={isGenerating}
                                      className="bg-gradient-to-r from-orange-500 to-red-600"
                                    >
                                      {isGenerating ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Generoidaan...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="w-4 h-4 mr-2" />
                                          Generoi
                                        </>
                                      )}
                                    </Button>
                                    {(generatedClaudeMd || reg.claude_md) && (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => copyToClipboard(generatedClaudeMd || reg.claude_md || '')}
                                          className="border-white/20 text-white"
                                        >
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => downloadClaudeMd(reg)}
                                          className="border-white/20 text-white"
                                        >
                                          <Download className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                                {(generatedClaudeMd || reg.claude_md) && (
                                  <ScrollArea className="h-64 rounded-md border border-white/10 p-4 bg-black/50">
                                    <pre className="text-xs text-white/70 whitespace-pre-wrap">
                                      {generatedClaudeMd || reg.claude_md}
                                    </pre>
                                  </ScrollArea>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="space-y-4">
              {contactSubmissions.length === 0 ? (
                <Card className="p-12 bg-white/5 border-white/10 text-center">
                  <Mail className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">Ei yhteydenottoja vielä</p>
                </Card>
              ) : (
                contactSubmissions.map((contact) => (
                  <Card key={contact.id} className="p-6 bg-white/5 border-white/10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{contact.subject}</h3>
                          <Badge className={
                            contact.type === 'complaint' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                            contact.type === 'support' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            'bg-green-500/20 text-green-400 border-green-500/30'
                          }>
                            {contact.type}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-white/60 mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {contact.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {contact.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(contact.created_at)}
                          </span>
                        </div>
                        <p className="text-white/70 text-sm">{contact.message}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10"
                        onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Vastaa
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Chat List */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white mb-4">Keskustelut</h3>
                {chatSessions.length === 0 ? (
                  <Card className="p-8 bg-white/5 border-white/10 text-center">
                    <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-white/40 text-sm">Ei keskusteluja</p>
                  </Card>
                ) : (
                  <ScrollArea className="h-[500px]">
                    {chatSessions.map((session) => (
                      <button
                        key={session.id}
                        onClick={() => loadChatMessages(session.id)}
                        className={`w-full p-4 rounded-lg text-left mb-2 transition-colors ${
                          selectedChat === session.id 
                            ? 'bg-orange-500/20 border border-orange-500/30' 
                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">
                            {session.visitor_id?.slice(0, 16) || 'Anonyymi'}...
                          </span>
                          <span className="text-xs text-white/40">
                            {session.chat_messages?.[0]?.count || 0} viestiä
                          </span>
                        </div>
                        <span className="text-xs text-white/50">
                          {formatDate(session.created_at)}
                        </span>
                      </button>
                    ))}
                  </ScrollArea>
                )}
              </div>

              {/* Chat Messages */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-white mb-4">Viestit</h3>
                <Card className="bg-white/5 border-white/10 h-[500px] flex flex-col">
                  {selectedChat ? (
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                msg.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 text-white/80'
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p className="text-[10px] opacity-50 mt-1">
                                {formatDate(msg.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-white/40">
                      <div className="text-center">
                        <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>Valitse keskustelu</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
