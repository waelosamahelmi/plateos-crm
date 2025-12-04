import { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import type { Order, OrderItem } from '../types/index.js';

interface CartViewProps {
  onClose: () => void;
}

export function CartView({ onClose }: CartViewProps) {
  const { language, addOrder } = useData();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'stripe'>('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const total = getCartTotal();
  const deliveryFee = orderType === 'delivery' ? 3.5 : 0;
  const finalTotal = total + deliveryFee;

  const handlePlaceOrder = () => {
    if (!customerName || !customerPhone) {
      alert(language === 'en' ? 'Please fill in all required fields' : 'Täytä kaikki pakolliset kentät');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress) {
      alert(language === 'en' ? 'Please enter delivery address' : 'Syötä toimitusosoite');
      return;
    }

    const orderNumber = `ORD-${Date.now()}`;
    const orderItems: OrderItem[] = cart.map((item, index) => ({
      id: index + 1,
      menuItemId: item.menuItem.id,
      menuItemName: item.menuItem.name,
      menuItemNameEn: item.menuItem.nameEn,
      quantity: item.quantity,
      unitPrice: item.totalPrice / item.quantity,
      totalPrice: item.totalPrice,
      specialInstructions: item.specialInstructions,
      toppings: item.selectedToppings.map(t => language === 'en' ? t.nameEn : t.name).join(', '),
    }));

    const order: Order = {
      id: Date.now(),
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      orderType,
      status: 'pending',
      subtotal: total,
      deliveryFee,
      totalAmount: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
      specialInstructions,
      items: orderItems,
      createdAt: new Date(),
    };

    addOrder(order);
    clearCart();

    alert(
      language === 'en'
        ? `Order placed successfully! Order number: ${orderNumber}`
        : `Tilaus tehty onnistuneesti! Tilausnumero: ${orderNumber}`
    );

    onClose();
  };

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {language === 'en' ? 'Your cart is empty' : 'Ostoskorisi on tyhjä'}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'en'
              ? 'Add some delicious items to get started!'
              : 'Lisää herkullisia tuotteita aloittaaksesi!'}
          </p>
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            {language === 'en' ? 'Continue Shopping' : 'Jatka ostoksia'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {language === 'en' ? 'Your Cart' : 'Ostoskorisi'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!showCheckout ? (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map(item => {
                  const name = language === 'en' ? item.menuItem.nameEn : item.menuItem.name;
                  const toppings = item.selectedToppings.map(t =>
                    language === 'en' ? t.nameEn : t.name
                  );

                  return (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{name}</h3>
                          {toppings.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              {toppings.join(', ')}
                            </p>
                          )}
                          {item.specialInstructions && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              "{item.specialInstructions}"
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 rounded-full p-1 hover:bg-gray-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-bold text-gray-800">
                          €{item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Subtotal' : 'Välisumma'}:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>{language === 'en' ? 'Total' : 'Yhteensä'}:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold text-lg"
              >
                {language === 'en' ? 'Proceed to Checkout' : 'Siirry kassalle'}
              </button>
            </>
          ) : (
            <>
              {/* Checkout Form */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">
                  {language === 'en' ? 'Delivery Information' : 'Toimitustiedot'}
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Name' : 'Nimi'} *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Phone' : 'Puhelin'} *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Email' : 'Sähköposti'}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Order Type' : 'Tilaustyyppi'} *
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setOrderType('pickup')}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                        orderType === 'pickup'
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {language === 'en' ? 'Pickup' : 'Nouto'}
                    </button>
                    <button
                      onClick={() => setOrderType('delivery')}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium ${
                        orderType === 'delivery'
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {language === 'en' ? 'Delivery' : 'Kotiinkuljetus'}
                    </button>
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {language === 'en' ? 'Delivery Address' : 'Toimitusosoite'} *
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                      rows={3}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Payment Method' : 'Maksutapa'} *
                  </label>
                  <div className="space-y-2">
                    {(['cash', 'card', 'stripe'] as const).map(method => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`w-full py-3 rounded-lg border-2 font-medium text-left px-4 ${
                          paymentMethod === method
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {method === 'cash' && (language === 'en' ? 'Cash on Delivery' : 'Käteinen')}
                        {method === 'card' && (language === 'en' ? 'Card on Delivery' : 'Kortti')}
                        {method === 'stripe' && (language === 'en' ? 'Pay Online (Demo)' : 'Maksa verkossa (Demo)')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'en' ? 'Special Instructions' : 'Erityisohjeet'}
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Subtotal' : 'Välisumma'}:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'en' ? 'Delivery Fee' : 'Toimitusmaksu'}:</span>
                    <span>€{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-800">
                  <span>{language === 'en' ? 'Total' : 'Yhteensä'}:</span>
                  <span>€{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  {language === 'en' ? 'Back to Cart' : 'Takaisin'}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg hover:bg-red-700 transition font-bold"
                >
                  {language === 'en' ? 'Place Order' : 'Tee tilaus'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
