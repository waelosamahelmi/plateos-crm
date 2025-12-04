import { useState } from "react";
import { useData } from "@/context/DataContext";
import { UniversalHeader } from "@/components/universal-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Euro
} from "lucide-react";
import type { Order } from "../types/index.js";

export function AdminPage() {
  const { language, orders, updateOrderStatus, menuItems } = useData();
  const [selectedTab, setSelectedTab] = useState("orders");

  const t = (fi: string, en: string, ar?: string) => {
    if (language === "fi") return fi;
    if (language === "en") return en;
    if (language === "ar" && ar) return ar;
    return fi;
  };

  // Calculate stats
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = completedOrders.length > 0
    ? totalRevenue / completedOrders.length
    : 0;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">{t("Odottaa", "Pending", "قيد الانتظار")}</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-500">{t("Hyväksytty", "Accepted", "مقبول")}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">{t("Valmis", "Completed", "مكتمل")}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{t("Peruttu", "Cancelled", "ملغي")}</Badge>;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fi' ? 'fi-FI' : 'en-US') + ' ' +
           date.toLocaleTimeString(language === 'fi' ? 'fi-FI' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
      <UniversalHeader />

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight drop-shadow-lg">
            {t("Hallintapaneeli", "Admin Dashboard", "لوحة الإدارة")}
          </h1>
          <p className="text-xl text-white/90 font-medium">
            {t("Hallinnoi tilauksia ja seuraa myyntiä", "Manage orders and track sales", "إدارة الطلبات وتتبع المبيعات")}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-stone-800 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("Odottavat", "Pending", "قيد الانتظار")}
                  </p>
                  <p className="text-3xl font-black text-yellow-600">{pendingOrders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-stone-800 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("Valmis", "Completed", "مكتمل")}
                  </p>
                  <p className="text-3xl font-black text-green-600">{completedOrders.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-stone-800 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("Kokonaismyynti", "Total Revenue", "الإيرادات الإجمالية")}
                  </p>
                  <p className="text-3xl font-black text-blue-600">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Euro className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-stone-800 border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t("Keskiarvo", "Avg. Order", "متوسط الطلب")}
                  </p>
                  <p className="text-3xl font-black text-purple-600">{formatPrice(averageOrderValue)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-stone-800 p-1 shadow-lg rounded-xl">
            <TabsTrigger value="orders" className="rounded-lg">
              {t("Tilaukset", "Orders", "الطلبات")} ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="products" className="rounded-lg">
              {t("Tuotteet", "Products", "المنتجات")} ({menuItems.length})
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            {orders.length === 0 ? (
              <Card className="bg-white dark:bg-stone-800 border-0 shadow-xl">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    {t("Ei tilauksia", "No orders yet", "لا توجد طلبات حتى الآن")}
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="bg-white dark:bg-stone-800 border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl font-black mb-2">
                          {t("Tilaus", "Order", "طلب")} #{order.orderNumber}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {order.customerName} · {order.customerPhone}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {formatDate(order.createdAt.toString())}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Order Items */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>
                              {language === "fi" ? item.menuItemName : item.menuItemNameEn} x {item.quantity}
                            </span>
                            <span className="font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="border-t pt-3 mt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{t("Välisumma", "Subtotal", "المجموع الفرعي")}:</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>{t("Toimitus", "Delivery", "التوصيل")}:</span>
                            <span>{formatPrice(order.deliveryFee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <span>{t("Yhteensä", "Total", "المجموع")}:</span>
                          <span className="text-red-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                          <strong>{t("Tyyppi", "Type", "النوع")}:</strong>{" "}
                          {order.orderType === 'delivery' ? t("Kotiinkuljetus", "Delivery", "التوصيل") : t("Nouto", "Pickup", "استلام")}
                        </p>
                        {order.deliveryAddress && (
                          <p>
                            <strong>{t("Osoite", "Address", "العنوان")}:</strong> {order.deliveryAddress}
                          </p>
                        )}
                        {order.specialInstructions && (
                          <p>
                            <strong>{t("Ohjeet", "Instructions", "التعليمات")}:</strong> {order.specialInstructions}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {order.status === 'pending' && (
                        <div className="flex gap-2 pt-3">
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                          >
                            {t("Hyväksy", "Accept", "قبول")}
                          </Button>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            variant="destructive"
                            className="flex-1"
                          >
                            {t("Peruuta", "Cancel", "إلغاء")}
                          </Button>
                        </div>
                      )}
                      {order.status === 'accepted' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {t("Merkitse valmiiksi", "Mark as Completed", "وضع علامة كمكتمل")}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id} className="bg-white dark:bg-stone-800 border-0 shadow-xl">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={item.imageUrl || "/placeholder-food.jpg"}
                      alt={language === "fi" ? item.name : item.nameEn}
                      className="w-full h-full object-cover"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg">
                          {t("Ei saatavilla", "Unavailable", "غير متوفر")}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">
                      {language === "fi" ? item.name : item.nameEn}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {language === "fi" ? item.description : item.descriptionEn}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-red-600">
                        {formatPrice(item.offerPrice || item.price)}
                      </span>
                      {item.isAvailable ? (
                        <Badge className="bg-green-500">{t("Saatavilla", "Available", "متاح")}</Badge>
                      ) : (
                        <Badge variant="secondary">{t("Loppu", "Out of stock", "نفذ المخزون")}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="h-20"></div>
    </div>
  );
}
