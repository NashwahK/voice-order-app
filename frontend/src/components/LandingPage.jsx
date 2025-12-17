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