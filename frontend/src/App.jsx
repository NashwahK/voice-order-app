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
