import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function RingSizeGuide() {
  const navigate = useNavigate();

  const ringSizeChart = [
    { us: '3', uk: 'F', eu: '44', circumference: '44.2', diameter: '14.1' },
    { us: '3.5', uk: 'G', eu: '45', circumference: '45.5', diameter: '14.5' },
    { us: '4', uk: 'H', eu: '47', circumference: '46.8', diameter: '14.9' },
    { us: '4.5', uk: 'I', eu: '48', circumference: '48.0', diameter: '15.3' },
    { us: '5', uk: 'J', eu: '49', circumference: '49.3', diameter: '15.7' },
    { us: '5.5', uk: 'K', eu: '51', circumference: '50.6', diameter: '16.1' },
    { us: '6', uk: 'L', eu: '52', circumference: '51.9', diameter: '16.5' },
    { us: '6.5', uk: 'M', eu: '53', circumference: '53.1', diameter: '16.9' },
    { us: '7', uk: 'N', eu: '54', circumference: '54.4', diameter: '17.3' },
    { us: '7.5', uk: 'O', eu: '56', circumference: '55.7', diameter: '17.7' },
    { us: '8', uk: 'P', eu: '57', circumference: '57.0', diameter: '18.1' },
    { us: '8.5', uk: 'Q', eu: '58', circumference: '58.3', diameter: '18.5' },
    { us: '9', uk: 'R', eu: '59', circumference: '59.5', diameter: '18.9' },
    { us: '9.5', uk: 'S', eu: '61', circumference: '60.8', diameter: '19.4' },
    { us: '10', uk: 'T', eu: '62', circumference: '62.1', diameter: '19.8' },
    { us: '10.5', uk: 'U', eu: '63', circumference: '63.4', diameter: '20.2' },
    { us: '11', uk: 'V', eu: '64', circumference: '64.6', diameter: '20.6' },
    { us: '11.5', uk: 'W', eu: '66', circumference: '65.9', diameter: '21.0' },
    { us: '12', uk: 'X', eu: '67', circumference: '67.2', diameter: '21.4' },
    { us: '12.5', uk: 'Y', eu: '68', circumference: '68.5', diameter: '21.8' },
    { us: '13', uk: 'Z', eu: '69', circumference: '69.7', diameter: '22.2' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#a67c52] to-[#7c5c36] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold mb-4">Ring Size Guide</h1>
          <p className="text-xl text-white/90">Find your perfect ring size with our comprehensive guide</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* How to Measure Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">How to Measure Your Ring Size</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Method 1 */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f0ede5] p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4 flex items-center">
                <span className="bg-[#D4AF37] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Using a Ring You Already Own
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Take a ring that fits the intended finger perfectly
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Measure the inner diameter of the ring in millimeters
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Compare with our size chart below
                </li>
              </ul>
            </div>

            {/* Method 2 */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f0ede5] p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4 flex items-center">
                <span className="bg-[#D4AF37] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Using a String or Paper Strip
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Wrap a string or paper strip around your finger
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Mark where the string/paper overlaps
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Measure the length in millimeters (circumference)
                </li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">💡 Pro Tips for Accurate Measurement</h4>
            <ul className="space-y-2 text-blue-700">
              <li>• Measure your finger at the end of the day when it's largest</li>
              <li>• Avoid measuring when your hands are cold</li>
              <li>• Consider the width of the ring - wider bands need larger sizes</li>
              <li>• Measure the finger you plan to wear the ring on</li>
              <li>• If between sizes, choose the larger size for comfort</li>
            </ul>
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Ring Size Chart</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">US Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">UK Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">EU Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Circumference (mm)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Diameter (mm)</th>
                </tr>
              </thead>
              <tbody>
                {ringSizeChart.map((size, index) => (
                  <tr key={size.us} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-3 font-medium text-[#D4AF37]">{size.us}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.uk}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.eu}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.circumference}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.diameter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ring Types Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Ring Types & Sizing Considerations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-3">Wide Bands (6mm+)</h3>
              <p className="text-gray-700 mb-3">Wide bands feel tighter than thin bands.</p>
              <p className="text-sm text-[#D4AF37] font-medium">Recommendation: Go up 0.5-1 size</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-3">Thin Bands (2-4mm)</h3>
              <p className="text-gray-700 mb-3">Thin bands feel looser and more comfortable.</p>
              <p className="text-sm text-[#D4AF37] font-medium">Recommendation: True to size</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-3">Engagement Rings</h3>
              <p className="text-gray-700 mb-3">Consider daily wear comfort and setting height.</p>
              <p className="text-sm text-[#D4AF37] font-medium">Recommendation: Slightly snug fit</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-3">Wedding Bands</h3>
              <p className="text-gray-700 mb-3">Should complement engagement ring if worn together.</p>
              <p className="text-sm text-[#D4AF37] font-medium">Recommendation: Match engagement ring size</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">What if I'm between two sizes?</h3>
              <p className="text-gray-700">Always choose the larger size for comfort. It's easier to resize a ring smaller than larger.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Do ring sizes vary by finger?</h3>
              <p className="text-gray-700">Yes! Each finger has a different size. Always measure the specific finger you plan to wear the ring on.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Can ring size change over time?</h3>
              <p className="text-gray-700">Yes, factors like weight changes, pregnancy, weather, and age can affect ring size.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Do you offer ring resizing services?</h3>
              <p className="text-gray-700">Yes, we offer professional ring resizing services. Contact our customer service for more information.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
            <p className="text-lg mb-6">Our jewelry experts are here to help you find the perfect fit!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="bg-white text-[#D4AF37] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate('/rings')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-colors"
              >
                Shop Rings
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
