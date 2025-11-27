function LandingPage({ onStartOrder }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-red-800 mb-4">
            KoreaLand!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Order your favourite Korean dishes with your voice
          </p>
          <p className="text-sm text-gray-500">
            powered by Gemini AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Menu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              { name: 'Kimchi Jjigae 김치찌개', price: 12 },
              { name: 'Bibimbap 비빔밥', price: 14 },
              { name: 'Bulgogi 불고기', price: 18 },
              { name: 'Tteokbokki 떡볶이', price: 10 },
              { name: 'Japchae 잡채', price: 13 },
              { name: 'Korean Fried Chicken 치킨', price: 16 },
              { name: 'Samgyeopsal 삼겹살', price: 20 },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-100 rounded-lg shadow-sm"
              >
                <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                <p className="text-gray-600">${item.price}</p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStartOrder}
          className="bg-red-700 hover:bg-red-800 text-white font-semibold text-2xl py-5 px-12 rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Start Voice Order
        </button>

        <p className="mt-6 text-gray-500">
          Click the button and speak naturally to place your order
        </p>
      </div>
    </div>
  );
}

export default LandingPage;
