import { useState } from 'react';
import LandingPage from './components/LandingPage';
import VoiceOrder from './components/VoiceOrder';
import OrderModal from './components/OrderModal';

function App() {
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleStartOrder = () => setOrderStarted(true);

  const handleOrderComplete = (data) => {
    setOrderData(data);
    setShowModal(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    fetch(`${backendUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: data.items,
        total: data.total,
        owner: 'Voice Order User'
      }),
    })
      .then(response => response.json())
      .then(result => {
        console.log('Order saved:', result);
      })
      .catch(error => {
        console.error('Failed to save order:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrderStarted(false);
    setOrderData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!orderStarted ? (
        <LandingPage onStartOrder={handleStartOrder} />
      ) : (
        <VoiceOrder onOrderComplete={handleOrderComplete} />
      )}

      {showModal && orderData && (
        <OrderModal orderData={orderData} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
