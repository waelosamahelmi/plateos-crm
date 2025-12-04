import { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Order } from '../types/index.js';
import { Clock, CheckCircle, XCircle, Package, Truck, Phone, Mail, MapPin } from 'lucide-react';

export function AdminView() {
  const { orders, language, updateOrderStatus } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders =
    selectedStatus === 'all'
      ? orders
      : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'accepted':
      case 'preparing':
        return <Package className="w-5 h-5" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const statusTranslations: Record<string, { en: string; fi: string }> = {
    all: { en: 'All Orders', fi: 'Kaikki tilaukset' },
    pending: { en: 'Pending', fi: 'Odottaa' },
    accepted: { en: 'Accepted', fi: 'Hyväksytty' },
    preparing: { en: 'Preparing', fi: 'Valmistetaan' },
    ready: { en: 'Ready', fi: 'Valmis' },
    completed: { en: 'Completed', fi: 'Valmistunut' },
    cancelled: { en: 'Cancelled', fi: 'Peruttu' },
  };

  const getStatusText = (status: string) => {
    return language === 'en'
      ? statusTranslations[status]?.en || status
      : statusTranslations[status]?.fi || status;
  };

  const nextStatus: Record<Order['status'], Order['status'] | null> = {
    pending: 'accepted',
    accepted: 'preparing',
    preparing: 'ready',
    ready: 'completed',
    completed: null,
    cancelled: null,
  };

  const handleStatusChange = (orderId: number, currentStatus: Order['status']) => {
    const next = nextStatus[currentStatus];
    if (next) {
      updateOrderStatus(orderId, next);
    }
  };

  const handleCancelOrder = (orderId: number) => {
    if (confirm(language === 'en' ? 'Cancel this order?' : 'Peruuta tämä tilaus?')) {
      updateOrderStatus(orderId, 'cancelled');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {language === 'en' ? 'Order Management' : 'Tilausten hallinta'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'en'
              ? `${orders.length} total orders`
              : `${orders.length} tilausta yhteensä`}
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'].map(
              status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedStatus === status
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getStatusText(status)}
                  {status !== 'all' && (
                    <span className="ml-2 text-sm">
                      ({orders.filter(o => o.status === status).length})
                    </span>
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {language === 'en' ? 'No orders found' : 'Ei tilauksia'}
            </h3>
            <p className="text-gray-600">
              {language === 'en'
                ? 'Orders will appear here when customers place them'
                : 'Tilaukset näkyvät täällä, kun asiakkaat tekevät niitä'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString(
                          language === 'en' ? 'en-US' : 'fi-FI'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-4 py-2 rounded-full font-medium flex items-center space-x-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </span>

                    {order.orderType === 'delivery' ? (
                      <Truck className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Package className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Customer Info */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-700">
                        {language === 'en' ? 'Customer Information' : 'Asiakastiedot'}
                      </h4>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{order.customerPhone}</span>
                      </div>
                      {order.customerEmail && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{order.customerEmail}</span>
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="flex items-start space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4 mt-1" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>

                    {/* Payment Info */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-gray-700">
                        {language === 'en' ? 'Payment Information' : 'Maksutiedot'}
                      </h4>
                      <div className="text-gray-600">
                        <p>
                          <span className="font-medium">
                            {language === 'en' ? 'Method:' : 'Tapa:'}
                          </span>{' '}
                          {order.paymentMethod.toUpperCase()}
                        </p>
                        <p>
                          <span className="font-medium">
                            {language === 'en' ? 'Status:' : 'Tila:'}
                          </span>{' '}
                          {order.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-bold text-gray-700 mb-3">
                      {language === 'en' ? 'Order Items' : 'Tilauksen tuotteet'}
                    </h4>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between bg-gray-50 p-3 rounded"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {item.quantity}x{' '}
                              {language === 'en' ? item.menuItemNameEn : item.menuItemName}
                            </div>
                            {item.toppings && (
                              <div className="text-sm text-gray-600 mt-1">{item.toppings}</div>
                            )}
                            {item.specialInstructions && (
                              <div className="text-sm text-gray-500 italic mt-1">
                                "{item.specialInstructions}"
                              </div>
                            )}
                          </div>
                          <div className="font-bold text-gray-800">
                            €{item.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Special Instructions */}
                  {order.specialInstructions && (
                    <div className="border-t mt-4 pt-4">
                      <h4 className="font-bold text-gray-700 mb-2">
                        {language === 'en' ? 'Special Instructions' : 'Erityisohjeet'}
                      </h4>
                      <p className="text-gray-600 italic">"{order.specialInstructions}"</p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="border-t mt-4 pt-4 space-y-1">
                    <div className="flex justify-between text-gray-600">
                      <span>{language === 'en' ? 'Subtotal:' : 'Välisumma:'}</span>
                      <span>€{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.deliveryFee > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>{language === 'en' ? 'Delivery Fee:' : 'Toimitusmaksu:'}</span>
                        <span>€{order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>{language === 'en' ? 'Total:' : 'Yhteensä:'}</span>
                      <span>€{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6">
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => handleStatusChange(order.id, order.status)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        {language === 'en'
                          ? `Mark as ${getStatusText(nextStatus[order.status]!)}`
                          : `Merkitse: ${getStatusText(nextStatus[order.status]!)}`}
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                      >
                        {language === 'en' ? 'Cancel' : 'Peruuta'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
