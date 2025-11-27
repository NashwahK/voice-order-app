function OrderModal({ orderData, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-md max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-green-700 text-white p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-center">Order Complete</h2>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-300">
                <p className="text-xl font-bold text-gray-800">Total</p>
                <p className="text-2xl font-bold text-green-600">
                  ${orderData.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">JSON Output</h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(orderData, null, 2)}</pre>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Start New Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
