function LandingPage({ onStartOrder }) {
  const menuItems = [
    { name: 'Bibimbap', korean: '비빔밥', price: 12.99, desc: 'Mixed rice with vegetables' },
    { name: 'Bulgogi', korean: '불고기', price: 15.99, desc: 'Marinated beef BBQ' },
    { name: 'Kimchi Jjigae', korean: '김치찌개', price: 11.99, desc: 'Spicy kimchi stew' },
    { name: 'Japchae', korean: '잡채', price: 10.99, desc: 'Stir-fried glass noodles' },
    { name: 'Tteokbokki', korean: '떡볶이', price: 9.99, desc: 'Spicy rice cakes' },
    { name: 'Korean Fried Chicken', korean: '치킨', price: 13.99, desc: 'Crispy fried chicken' },
    { name: 'Samgyeopsal', korean: '삼겹살', price: 16.99, desc: 'Grilled pork belly' },
    { name: 'Seafood Pancake', korean: '해물파전', price: 11.99, desc: 'Crispy seafood pancake' },
    { name: 'Soju', korean: '소주', price: 8.99, desc: 'Korean spirit' },
    { name: 'Makgeolli', korean: '막걸리', price: 7.99, desc: 'Rice wine' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-700 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-red-800 mb-3 sm:mb-4">
            한식당
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-3 sm:mb-4">
            KoreaLand
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-2">
            Voice-powered Korean restaurant
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            Powered by Gemini AI
          </p>
        </div>

        {/* Menu Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-4 sm:p-8 mb-8 border border-red-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
            Menu
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="group bg-gradient-to-br from-white to-red-50 p-4 rounded-xl border-2 border-red-100 hover:border-red-400 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-bold text-base sm:text-lg text-gray-900">{item.name}</p>
                    <p className="text-xs sm:text-sm text-red-600 font-medium">{item.korean}</p>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-red-700">${item.price}</p>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onStartOrder}
            className="group relative bg-red-700 hover:bg-red-800 text-white font-bold text-xl sm:text-2xl py-4 sm:py-6 px-8 sm:px-16 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-red-500/50"
          >
            <span className="flex items-center gap-3 sm:gap-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Voice Order
            </span>
          </button>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600">
            Tap the button and speak naturally to place your order
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
// import React from 'react';

// const LandingPage = ({ onStartOrder }) => {
//   return (
//     <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="text-center mb-8 sm:mb-12">
//         <div className="inline-block mb-4 sm:mb-6">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sharp-blue rounded-full flex items-center justify-center">
//             <svg 
//               className="w-8 h-8 sm:w-10 sm:h-10 text-white" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//             >
//               <path 
//                 strokeLinecap="round" 
//                 strokeLinejoin="round" 
//                 strokeWidth={2} 
//                 d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
//               />
//             </svg>
//           </div>
//         </div>
//         <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
//           한식당
//         </h1>
//         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sharp-blue mb-4 sm:mb-6">
//           Voice Order System
//         </h2>
//         <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
//           Order your favorite Korean dishes using voice commands. 
//           Speak naturally and let AI take your order!
//         </p>
//       </div>

//       {/* Features */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl w-full">
//         <div className="bg-dark-secondary p-4 sm:p-6 rounded-lg border border-dark-tertiary hover:border-sharp-blue transition-colors">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sharp-blue/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
//             <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sharp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//             </svg>
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Voice Enabled</h3>
//           <p className="text-gray-400 text-sm sm:text-base">Continuous voice recognition</p>
//         </div>

//         <div className="bg-dark-secondary p-4 sm:p-6 rounded-lg border border-dark-tertiary hover:border-sharp-blue transition-colors">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sharp-blue/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
//             <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sharp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//             </svg>
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">AI Powered</h3>
//           <p className="text-gray-400 text-sm sm:text-base">Google Gemini 2.0 Flash</p>
//         </div>

//         <div className="bg-dark-secondary p-4 sm:p-6 rounded-lg border border-dark-tertiary hover:border-sharp-blue transition-colors">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sharp-blue/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
//             <svg className="w-5 h-5 sm:w-6 sm:h-6 text-sharp-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//             </svg>
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Instant Summary</h3>
//           <p className="text-gray-400 text-sm sm:text-base">Get structured JSON order output</p>
//         </div>
//       </div>

//       {/* CTA Button */}
//       <button
//         onClick={onStartOrder}
//         className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-sharp-blue text-white text-lg sm:text-xl font-semibold rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-sharp-blue/50 transform hover:scale-105"
//       >
//         <span className="flex items-center gap-3">
//           <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//           </svg>
//           Start Voice Ordering
//         </span>
//       </button>

//       {/* New Badge */}
//       <div className="mt-4 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full">
//         <span className="text-green-400 text-sm font-medium">✨ Click once and speak - hands-free ordering!</span>
//       </div>

//       {/* Menu Preview */}
//       <div className="mt-12 sm:mt-16 text-center">
//         <p className="text-gray-500 text-sm sm:text-base mb-4">Popular dishes available</p>
//         <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl">
//           {['Bibimbap', 'Bulgogi', 'Kimchi Jjigae', 'Japchae', 'Tteokbokki', 'Korean Fried Chicken'].map((dish) => (
//             <span 
//               key={dish} 
//               className="px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-secondary text-gray-300 text-xs sm:text-sm rounded-full border border-dark-tertiary"
//             >
//               {dish}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="mt-12 sm:mt-16 text-center text-gray-500 text-xs sm:text-sm">
//         <p>Powered by Google Gemini 2.0 Flash • Built with React & TailwindCSS</p>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;