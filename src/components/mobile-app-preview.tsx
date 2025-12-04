import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/language-context";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  ChevronDown, 
  Bell, 
  CheckCircle2,
  Clock,
  Settings,
  BarChart3,
  Package,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileAppPreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "analytics" | "settings">("orders");
  const { t } = useLanguage();
  const { orders } = useData();
  const [showNotification, setShowNotification] = useState(false);

  // Show notification when new order is placed
  useEffect(() => {
    if (orders.length > 0) {
      setShowNotification(true);
      
      // Generate notification sound using Web Audio API
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
        
        // Second beep
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
      case "confirmed": return "bg-blue-500";
      case "preparing": return "bg-purple-500";
      case "ready": return "bg-green-500";
      case "delivered": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { fi: string; en: string }> = {
      pending: { fi: "Odottaa", en: "Pending" },
      confirmed: { fi: "Vahvistettu", en: "Confirmed" },
      preparing: { fi: "Valmistetaan", en: "Preparing" },
      ready: { fi: "Valmis", en: "Ready" },
      delivered: { fi: "Toimitettu", en: "Delivered" },
      cancelled: { fi: "Peruutettu", en: "Cancelled" },
    };
    return t(statusMap[status]?.fi || status, statusMap[status]?.en || status);
  };

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0;

  return (
    <>
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in">
          <Card className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-4 shadow-2xl border-0 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bell className="w-5 h-5 animate-bounce-subtle" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">
                  {t("Uusi tilaus!", "New Order!")}
                </h4>
                <p className="text-xs opacity-90">
                  {t("Tilaus odottaa vahvistusta", "Order awaiting confirmation")}
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
        isExpanded ? "w-96" : "w-auto"
      )}>
        {/* Collapsed Button */}
        {!isExpanded && (
          <Button
            onClick={() => setIsExpanded(true)}
            className="gradient-primary text-white shadow-2xl hover:shadow-xl transition-all h-14 px-6 rounded-full relative"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            <span className="font-semibold">{t("Sovellus", "Mobile App")}</span>
            {orders.filter(o => o.status === "pending").length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-0 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                {orders.filter(o => o.status === "pending").length}
              </Badge>
            )}
          </Button>
        )}

        {/* Expanded Widget */}
        {isExpanded && (
          <Card className="bg-white dark:bg-gray-900 shadow-2xl border-2 border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
            {/* Header */}
            <div className="gradient-primary text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <h3 className="font-bold text-lg">
                    {t("Ravintola-sovellus", "Restaurant App")}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Tabs */}
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === "orders" 
                      ? "bg-white text-red-600" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  <Package className="w-4 h-4 inline mr-1" />
                  {t("Tilaukset", "Orders")}
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === "analytics" 
                      ? "bg-white text-red-600" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  <BarChart3 className="w-4 h-4 inline mr-1" />
                  {t("Tilastot", "Analytics")}
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={cn(
                    "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === "settings" 
                      ? "bg-white text-red-600" 
                      : "bg-white/20 text-white hover:bg-white/30"
                  )}
                >
                  <Settings className="w-4 h-4 inline mr-1" />
                  {t("Asetukset", "Settings")}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {t("Aktiiviset tilaukset", "Active Orders")}
                    </h4>
                    <Badge variant="outline" className="border-red-500 text-red-600">
                      {orders.filter(o => o.status !== "completed" && o.status !== "cancelled").length} {t("kpl", "items")}
                    </Badge>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("Ei tilauksia", "No orders yet")}
                      </p>
                    </div>
                  ) : (
                    orders
                      .filter(o => o.status !== "completed" && o.status !== "cancelled")
                      .slice(0, 10)
                      .map((order) => (
                        <Card key={order.id} className="p-3 hover:shadow-md transition-shadow border-2 border-gray-100 dark:border-gray-800">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-gray-900 dark:text-gray-100">
                                  #{order.id}
                                </span>
                                <Badge className={cn("text-white border-0", getStatusColor(order.status))}>
                                  {getStatusText(order.status)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(order.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-red-600">
                                €{order.totalAmount.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {order.items.length} {t("tuotetta", "items")}
                              </p>
                            </div>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-700 dark:text-gray-300">
                                  {item.quantity}x {item.menuItemName}
                                </span>
                                <span className="text-gray-500">
                                  €{(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-xs text-gray-400 italic">
                                +{order.items.length - 2} {t("muuta", "more")}
                              </p>
                            )}
                          </div>

                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" className="flex-1 h-8 text-xs gradient-primary text-white">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {t("Vahvista", "Confirm")}
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {t("Valmis", "Ready")}
                            </Button>
                          </div>
                        </Card>
                      ))
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {t("Tänään", "Today's Stats")}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("Tilauksia", "Orders")}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {todayOrders.length}
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("Liikevaihto", "Revenue")}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        €{totalRevenue.toFixed(0)}
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("Keskim. tilaus", "Avg Order")}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        €{avgOrderValue.toFixed(2)}
                      </p>
                    </Card>
                    
                    <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t("Odottaa", "Pending")}
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {orders.filter(o => o.status === "pending").length}
                      </p>
                    </Card>
                  </div>

                  <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                    <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-3">
                      {t("Tilausten tila", "Order Status")}
                    </h5>
                    <div className="space-y-2">
                      {["pending", "confirmed", "preparing", "ready", "delivered"].map(status => {
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
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {t("Sovelluksen asetukset", "App Settings")}
                  </h4>

                  <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                    <h5 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                      {t("Ilmoitukset", "Notifications")}
                    </h5>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t("Ääni-ilmoitukset", "Sound Notifications")}
                        </span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t("Push-ilmoitukset", "Push Notifications")}
                        </span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t("Sähköposti-ilmoitukset", "Email Notifications")}
                        </span>
                        <input type="checkbox" className="toggle" />
                      </label>
                    </div>
                  </Card>

                  <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                    <h5 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                      {t("Näyttö", "Display")}
                    </h5>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t("Automaattinen päivitys", "Auto Refresh")}
                        </span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t("Näytä tilausnumero", "Show Order Numbers")}
                        </span>
                        <input type="checkbox" defaultChecked className="toggle" />
                      </label>
                    </div>
                  </Card>

                  <Card className="p-4 border-2 border-gray-100 dark:border-gray-800">
                    <h5 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">
                      {t("Tilausten hallinta", "Order Management")}
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          {t("Automaattinen vahvistus (min)", "Auto-confirm (min)")}
                        </label>
                        <input 
                          type="number" 
                          defaultValue="5"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          {t("Valmistusaika (min)", "Prep time (min)")}
                        </label>
                        <input 
                          type="number" 
                          defaultValue="20"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </Card>

                  <Button className="w-full gradient-primary text-white">
                    {t("Tallenna asetukset", "Save Settings")}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
