import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Smartphone, 
  ChevronDown,
  Bell,
  CheckCircle2,
  Clock,
  Settings,
  BarChart3,
  Package,
  X,
  ChefHat,
  Tag,
  Mail,
  Calendar,
  TrendingUp,
  Euro,
  Users,
  UtensilsCrossed,
  Edit,
  Trash2,
  Plus,
  Search,
  Printer,
  Globe,
  CreditCard,
  Wallet,
  Banknote,
  MapPin,
  Store,
  Coffee,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, MenuItem, Promotion } from "@/types";
import { MenuItemEditModal } from "@/components/menu-item-edit-modal";
import { PromotionModal } from "@/components/promotion-modal";
import { ThemeCustomizer } from "@/components/theme-customizer";

export function MobileAppPreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const { language, t } = useLanguage();
  const { orders, menuItems, categories, updateOrderStatus, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const [showNotification, setShowNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const adminT = (fi: string, en: string) => t(fi, en);

  // Show notification when new order is placed
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === "pending");
    if (pendingOrders.length > 0 && !showNotification) {
      setShowNotification(true);
      
      // Generate notification sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setTimeout(() => {
          const oscillator2 = audioContext.createOscillator();
          const gainNode2 = audioContext.createGain();
          
          oscillator2.connect(gainNode2);
          gainNode2.connect(audioContext.destination);
          
          oscillator2.frequency.value = 1000;
          oscillator2.type = 'sine';
          
          gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator2.start(audioContext.currentTime);
          oscillator2.stop(audioContext.currentTime + 0.3);
        }, 200);
      } catch (error) {
        console.log('🔔 New Order Notification!');
      }
      
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [orders.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "confirmed":
      case "accepted": return "bg-blue-500";
      case "preparing": return "bg-purple-500";
      case "ready": return "bg-green-500";
      case "delivered":
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { fi: string; en: string }> = {
      pending: { fi: "Odottaa", en: "Pending" },
      confirmed: { fi: "Vahvistettu", en: "Confirmed" },
      accepted: { fi: "Hyväksytty", en: "Accepted" },
      preparing: { fi: "Valmistetaan", en: "Preparing" },
      ready: { fi: "Valmis", en: "Ready" },
      delivered: { fi: "Toimitettu", en: "Delivered" },
      completed: { fi: "Valmis", en: "Completed" },
      cancelled: { fi: "Peruutettu", en: "Cancelled" },
    };
    return t(statusMap[status]?.fi || status, statusMap[status]?.en || status);
  };

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const pendingOrders = orders.filter(o => o.status === "pending");
  const completedOrders = orders.filter(o => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as Order['status']);
  };

  return (
    <>
      {/* Notification Toast */}
      {showNotification && pendingOrders.length > 0 && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <Card className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 shadow-2xl border-0 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bell className="w-5 h-5 animate-bounce-subtle" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">
                  {adminT("Uusi tilaus!", "New Order!")}
                </h4>
                <p className="text-xs opacity-90">
                  {adminT(`Tilaus #${pendingOrders[0].id} odottaa vahvistusta`, `Order #${pendingOrders[0].id} awaiting confirmation`)}
                </p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Mobile App Widget */}
      <div className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-300",
        isExpanded ? "w-[450px]" : "w-auto"
      )}>
        {/* Collapsed Button */}
        {!isExpanded && (
          <Button
            onClick={() => setIsExpanded(true)}
            className="gradient-primary text-white shadow-2xl hover:shadow-xl transition-all h-14 px-6 rounded-full relative"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            <span className="font-semibold">{adminT("Sovellus", "Mobile App")}</span>
            {pendingOrders.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0 h-6 w-6 rounded-full p-0 flex items-center justify-center animate-pulse">
                {pendingOrders.length}
              </Badge>
            )}
          </Button>
        )}

        {/* Expanded Widget - Full Admin Interface */}
        {isExpanded && (
          <Card className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-gray-200 dark:border-gray-700 h-[700px] flex flex-col">
            {/* Header - Babylon Style */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UtensilsCrossed className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        Ravintola Babylon
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {adminT("Hallintapaneeli", "Admin Panel")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                    className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-2">
                    <p className="text-xs opacity-90">{adminT("Tänään", "Today")}</p>
                    <p className="text-xl font-bold">{todayOrders.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-2">
                    <p className="text-xs opacity-90">{adminT("Liikevaihto", "Revenue")}</p>
                    <p className="text-xl font-bold">€{totalRevenue.toFixed(0)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-2">
                    <p className="text-xs opacity-90">{adminT("Odottaa", "Pending")}</p>
                    <p className="text-xl font-bold">{pendingOrders.length}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-2">
                    <p className="text-xs opacity-90">{adminT("Tuotteet", "Products")}</p>
                    <p className="text-xl font-bold">{menuItems.length}</p>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700 rounded-none">
                  <TabsTrigger value="orders" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <Clock className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Tilaukset", "Orders")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="menu" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <ChefHat className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Ruokalista", "Menu")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="promotions" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <Tag className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Tarjoukset", "Promos")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <BarChart3 className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Tilastot", "Analytics")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <Settings className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Asetukset", "Settings")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="marketing" className="flex flex-col items-center justify-center space-y-1 px-1 py-2 text-[10px] font-medium h-auto">
                    <Mail className="w-3 h-3" />
                    <span className="text-center leading-tight">{adminT("Markkinointi", "Marketing")}</span>
                  </TabsTrigger>
                </TabsList>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 bg-white dark:bg-gray-900" style={{ height: '520px' }}>
                  {/* ORDERS TAB */}
                  <TabsContent value="orders" className="space-y-3 mt-0">
                    {/* Search and Filter */}
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={adminT("Hae tilauksia...", "Search orders...")}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        />
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-9 px-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="all">{adminT("Kaikki", "All")}</option>
                        <option value="pending">{adminT("Odottaa", "Pending")}</option>
                        <option value="accepted">{adminT("Hyväksytty", "Accepted")}</option>
                        <option value="preparing">{adminT("Valmistetaan", "Preparing")}</option>
                        <option value="ready">{adminT("Valmis", "Ready")}</option>
                        <option value="delivered">{adminT("Toimitettu", "Delivered")}</option>
                      </select>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {adminT("Ei tilauksia", "No orders found")}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredOrders.slice(0, 20).map((order) => (
                          <Card key={order.id} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Badge className={cn("text-white border-0 text-xs", getStatusColor(order.status))}>
                                      {getStatusText(order.status)}
                                    </Badge>
                                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                      #{order.id}
                                    </span>
                                  </div>
                                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {order.customerName}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(order.createdAt).toLocaleTimeString()} · {order.customerPhone}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-sm text-green-600 dark:text-green-400">
                                    €{order.totalAmount.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {order.items.length} {adminT("tuotetta", "items")}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Order Items Preview */}
                              <div className="space-y-1 mb-2">
                                {order.items.slice(0, 2).map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                                    <span>{item.quantity}x {item.menuItemName}</span>
                                    <span>€{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <p className="text-xs text-gray-400 italic">
                                    +{order.items.length - 2} {adminT("muuta", "more")}
                                  </p>
                                )}
                              </div>

                              {/* Action Buttons */}
                              {order.status === "pending" && (
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    className="flex-1 h-7 text-xs gradient-primary text-white"
                                    onClick={() => handleStatusChange(order.id, "accepted")}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {adminT("Hyväksy", "Accept")}
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-7 text-xs"
                                    onClick={() => handleStatusChange(order.id, "cancelled")}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                              {order.status === "accepted" && (
                                <Button 
                                  size="sm" 
                                  className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                  onClick={() => handleStatusChange(order.id, "preparing")}
                                >
                                  {adminT("Aloita valmistus", "Start Preparing")}
                                </Button>
                              )}
                              {order.status === "preparing" && (
                                <Button 
                                  size="sm" 
                                  className="w-full h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleStatusChange(order.id, "ready")}
                                >
                                  {adminT("Merkitse valmiiksi", "Mark Ready")}
                                </Button>
                              )}
                              {order.status === "ready" && (
                                <Button 
                                  size="sm" 
                                  className="w-full h-7 text-xs bg-gray-600 hover:bg-gray-700 text-white"
                                  onClick={() => handleStatusChange(order.id, "delivered")}
                                >
                                  {adminT("Toimitettu", "Delivered")}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* MENU TAB */}
                  <TabsContent value="menu" className="space-y-3 mt-0">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {adminT("Ruokalista", "Menu Items")} ({menuItems.length})
                      </h4>
                      <Button 
                        size="sm" 
                        className="h-8 text-xs gradient-primary text-white"
                        onClick={() => {
                          setEditingMenuItem(null);
                          setShowMenuModal(true);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {adminT("Uusi", "New")}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {menuItems.slice(0, 15).map((item) => (
                        <Card key={item.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              {item.imageUrl && (
                                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                              )}
                              <div className="flex-1">
                                <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{item.name}</h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</p>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                                  €{typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                                </p>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Badge variant={item.isAvailable ? "default" : "secondary"} className="text-xs">
                                  {item.isAvailable ? adminT("Saatavilla", "Available") : adminT("Ei saatavilla", "Unavailable")}
                                </Badge>
                                <div className="flex space-x-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      setEditingMenuItem(item);
                                      setShowMenuModal(true);
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0 text-red-600"
                                    onClick={() => {
                                      if (confirm(adminT("Haluatko varmasti poistaa tämän tuotteen?", "Are you sure you want to delete this item?"))) {
                                        deleteMenuItem(item.id);
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* PROMOTIONS TAB */}
                  <TabsContent value="promotions" className="space-y-3 mt-0">
                    {promotions.length === 0 ? (
                      <div className="text-center py-12">
                        <Tag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {adminT("Kampanjat ja tarjoukset", "Promotions & Offers")}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          {adminT("Luo houkuttelevia tarjouksia asiakkaillesi", "Create attractive offers for your customers")}
                        </p>
                        <Button 
                          className="gradient-primary text-white"
                          onClick={() => setShowPromotionModal(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {adminT("Luo tarjous", "Create Promotion")}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {adminT("Aktiiviset tarjoukset", "Active Promotions")} ({promotions.length})
                          </h4>
                          <Button 
                            size="sm" 
                            className="h-8 text-xs gradient-primary text-white"
                            onClick={() => setShowPromotionModal(true)}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {adminT("Uusi", "New")}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {promotions.map((promo) => (
                            <Card key={promo.id} className="border border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <Badge className="bg-red-600 text-white">{adminT("Tarjous", "OFFER")}</Badge>
                                      {promo.isActive && <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">{adminT("Aktiivinen", "Active")}</Badge>}
                                    </div>
                                    <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{language === "fi" ? promo.title : promo.titleEn}</h5>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === "fi" ? promo.description : promo.descriptionEn}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end space-y-1">
                                    <div className="text-2xl font-black text-red-600">
                                      {promo.discountType === "percentage" ? `${promo.discountValue}%` : `€${promo.discountValue}`}
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="h-6 w-6 p-0 text-red-600"
                                      onClick={() => setPromotions(promotions.filter(p => p.id !== promo.id))}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* ANALYTICS TAB */}
                  <TabsContent value="analytics" className="space-y-3 mt-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {adminT("Tämän päivän tilastot", "Today's Analytics")}
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: adminT("Tilauksia", "Orders"), value: todayOrders.length, icon: Calendar, color: "from-indigo-500 to-indigo-600" },
                        { label: adminT("Liikevaihto", "Revenue"), value: `€${totalRevenue.toFixed(0)}`, icon: Euro, color: "from-emerald-500 to-emerald-600" },
                        { label: adminT("Keskim. tilaus", "Avg Order"), value: `€${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: "from-amber-500 to-amber-600" },
                        { label: adminT("Asiakkaita", "Customers"), value: new Set(orders.map(o => o.customerPhone)).size, icon: Users, color: "from-rose-500 to-rose-600" },
                      ].map((stat, idx) => (
                        <Card key={idx} className={`bg-gradient-to-r ${stat.color} text-white border-0 shadow-lg`}>
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs opacity-90">{stat.label}</p>
                                <p className="text-xl font-bold mt-1">{stat.value}</p>
                              </div>
                              <div className="bg-white/20 rounded-lg p-2">
                                <stat.icon className="w-5 h-5" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Order Status Breakdown */}
                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{adminT("Tilausten tila", "Order Status")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {["pending", "accepted", "preparing", "ready", "delivered", "cancelled"].map(status => {
                            const count = orders.filter(o => o.status === status).length;
                            const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                            return (
                              <div key={status}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">{getStatusText(status)}</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{count}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={cn("h-2 rounded-full transition-all", getStatusColor(status))}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Payment Methods */}
                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">{adminT("Maksutavat", "Payment Methods")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {["online", "cash", "card"].map(method => {
                            const methodOrders = orders.filter(o => o.paymentMethod === method);
                            const count = methodOrders.length;
                            const revenue = methodOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                            const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
                            const Icon = method === "online" ? CreditCard : method === "cash" ? Wallet : Banknote;
                            return (
                              <div key={method} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {method === "online" ? adminT("Verkko", "Online") : 
                                     method === "cash" ? adminT("Käteinen", "Cash") : 
                                     adminT("Kortti", "Card")}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-green-600 dark:text-green-400">€{revenue.toFixed(2)}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(0)}%</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* SETTINGS TAB */}
                  <TabsContent value="settings" className="space-y-3 mt-0">
                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm">{adminT("Ravintolan asetukset", "Restaurant Settings")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{adminT("Automaattinen vahvistus", "Auto-accept orders")}</Label>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{adminT("Ääni-ilmoitukset", "Sound notifications")}</Label>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">{adminT("Tulostin käytössä", "Printer enabled")}</Label>
                            <Switch />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500 dark:text-gray-400">
                            {adminT("Valmistusaika (min)", "Prep time (min)")}
                          </Label>
                          <Input 
                            type="number" 
                            defaultValue="20"
                            className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500 dark:text-gray-400">
                            {adminT("Toimitusaika (min)", "Delivery time (min)")}
                          </Label>
                          <Input 
                            type="number" 
                            defaultValue="30"
                            className="h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <CardHeader>
                        <CardTitle className="text-sm">{adminT("Pika-asetukset", "Quick Settings")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start h-9 text-sm bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800"
                          onClick={() => setShowThemeCustomizer(true)}
                        >
                          <Palette className="w-4 h-4 mr-2 text-red-600" />
                          <span className="font-semibold text-red-600">{adminT("Teeman muokkaus", "Theme Customization")}</span>
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-9 text-sm">
                          <Coffee className="w-4 h-4 mr-2" />
                          {adminT("Kategorioiden hallinta", "Category Management")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-9 text-sm">
                          <Store className="w-4 h-4 mr-2" />
                          {adminT("Toimipisteiden hallinta", "Branch Management")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-9 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {adminT("Ruokapisteet", "Food Locations")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-9 text-sm">
                          <Printer className="w-4 h-4 mr-2" />
                          {adminT("Tulostimet", "Printers")}
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-9 text-sm">
                          <Globe className="w-4 h-4 mr-2" />
                          {adminT("Sivuston asetukset", "Website Settings")}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* MARKETING TAB */}
                  <TabsContent value="marketing" className="space-y-3 mt-0">
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {adminT("Sähköpostimarkkinointi", "Email Marketing")}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {adminT("Lähetä uutiskirjeitä ja tarjouksia asiakkaillesi", "Send newsletters and offers to your customers")}
                      </p>
                      <Button className="gradient-primary text-white">
                        <Mail className="w-4 h-4 mr-2" />
                        {adminT("Luo kampanja", "Create Campaign")}
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </Card>
        )}

        {/* Modals */}
        <MenuItemEditModal
          isOpen={showMenuModal}
          onClose={() => {
            setShowMenuModal(false);
            setEditingMenuItem(null);
          }}
          item={editingMenuItem}
          onSave={(item) => {
            if (editingMenuItem) {
              updateMenuItem(item);
            } else {
              addMenuItem(item);
            }
            setShowMenuModal(false);
            setEditingMenuItem(null);
          }}
          categories={categories}
          language={language}
        />

        <PromotionModal
          isOpen={showPromotionModal}
          onClose={() => setShowPromotionModal(false)}
          onSave={(promotion) => {
            setPromotions([...promotions, promotion]);
            setShowPromotionModal(false);
          }}
          language={language}
        />

        <ThemeCustomizer
          isOpen={showThemeCustomizer}
          onClose={() => setShowThemeCustomizer(false)}
          language={language}
        />
      </div>
    </>
  );
}
