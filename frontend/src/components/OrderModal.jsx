function OrderModal({ orderData, onClose }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Header */}
        <div className="bg-gray-50 border-b-2 border-dashed border-gray-300 p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">한식당</h1>
          <h2 className="text-xl font-semibold text-red-700 mb-2">KoreaLand</h2>
          <p className="text-xs text-gray-600">Voice Order Receipt</p>
          <p className="text-xs text-gray-500 mt-1">{currentDate}</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 font-mono text-sm">
          <div className="border-b border-dashed border-gray-300 pb-4 mb-4">
            <p className="text-xs text-gray-600 mb-2">ORDER DETAILS</p>
            {orderData.items.map((item, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800 flex-1">{item.name}</span>
                  <span className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{item.quantity} × ${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="border-b border-dashed border-gray-300 pb-4 mb-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${orderData.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (8%)</span>
              <span>${(orderData.total * 0.08).toFixed(2)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-bold mb-6">
            <span className="text-gray-800">TOTAL</span>
            <span className="text-red-700 text-2xl">${(orderData.total * 1.08).toFixed(2)}</span>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-600 border-t border-dashed border-gray-300 pt-4">
            <p className="mb-1">Thank you for your order!</p>
            <p className="text-gray-500">Order placed via Voice AI</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            Place New Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
