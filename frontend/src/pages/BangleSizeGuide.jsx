import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

export default function BangleSizeGuide() {
  const navigate = useNavigate();

  const bangleSizeChart = [
    { size: 'XS', wrist: '5.5" - 6"', circumference: '140-152mm', bangles: '2.25"', bracelets: 'Adjustable' },
    { size: 'S', wrist: '6" - 6.5"', circumference: '152-165mm', bangles: '2.375"', bracelets: '6.5" - 7"' },
    { size: 'M', wrist: '6.5" - 7"', circumference: '165-178mm', bangles: '2.5"', bracelets: '7" - 7.5"' },
    { size: 'L', wrist: '7" - 7.5"', circumference: '178-191mm', bangles: '2.625"', bracelets: '7.5" - 8"' },
    { size: 'XL', wrist: '7.5" - 8"', circumference: '191-203mm', bangles: '2.75"', bracelets: '8" - 8.5"' },
    { size: 'XXL', wrist: '8" - 8.5"', circumference: '203-216mm', bangles: '2.875"', bracelets: '8.5" - 9"' }
  ];

  const bangleTypes = [
    {
      type: 'Rigid Bangles',
      description: 'Traditional solid bangles that slip over the hand',
      sizing: 'Must fit over your knuckles - measure hand at widest point',
      tip: 'Add 0.25" to wrist measurement for comfort'
    },
    {
      type: 'Hinged Bangles',
      description: 'Bangles with a hinge mechanism for easy wearing',
      sizing: 'Should fit snugly around wrist when closed',
      tip: 'Can be sized closer to actual wrist measurement'
    },
    {
      type: 'Cuff Bracelets',
      description: 'Open-ended bracelets that can be adjusted',
      sizing: 'Adjustable design accommodates various wrist sizes',
      tip: 'Choose based on desired fit - snug or loose'
    },
    {
      type: 'Chain Bracelets',
      description: 'Flexible bracelets with clasp closure',
      sizing: 'Add 0.5" to 1" to wrist measurement for movement',
      tip: 'Consider charm additions when sizing'
    }
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
          <h1 className="text-4xl font-bold mb-4">Bangle & Bracelet Size Guide</h1>
          <p className="text-xl text-white/90">Find your perfect fit for bangles, bracelets, and cuffs</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* How to Measure Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">How to Measure Your Wrist</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Method 1 - For Bangles */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f0ede5] p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4 flex items-center">
                <span className="bg-[#D4AF37] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                For Rigid Bangles
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Bring your thumb and pinky finger together
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Measure across the widest part of your hand
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  This is your bangle diameter measurement
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Add 0.25" for comfortable movement
                </li>
              </ul>
            </div>

            {/* Method 2 - For Bracelets */}
            <div className="bg-gradient-to-br from-[#f8f6f0] to-[#f0ede5] p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4 flex items-center">
                <span className="bg-[#D4AF37] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                For Bracelets & Cuffs
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Wrap a measuring tape around your wrist
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Place it where you normally wear bracelets
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Keep tape snug but not tight
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">•</span>
                  Add 0.5" to 1" for desired looseness
                </li>
              </ul>
            </div>
          </div>

          {/* Visual Guide */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">📏 Measuring Tips</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
              <div>
                <h5 className="font-medium mb-2">For Accurate Measurements:</h5>
                <ul className="space-y-1 text-sm">
                  <li>• Use a flexible measuring tape</li>
                  <li>• Measure your dominant hand (usually larger)</li>
                  <li>• Measure at room temperature</li>
                  <li>• Don't measure over clothing or watches</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Fit Preferences:</h5>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Snug:</strong> Add 0.25" to wrist measurement</li>
                  <li>• <strong>Comfortable:</strong> Add 0.5" to wrist measurement</li>
                  <li>• <strong>Loose:</strong> Add 0.75" to 1" to wrist measurement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Size Chart</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Wrist Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Circumference</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Bangle Diameter</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Bracelet Length</th>
                </tr>
              </thead>
              <tbody>
                {bangleSizeChart.map((size, index) => (
                  <tr key={size.size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-3 font-bold text-[#D4AF37] text-lg">{size.size}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.wrist}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.circumference}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.bangles}</td>
                    <td className="border border-gray-300 px-4 py-3">{size.bracelets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bangle Types Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Types of Bangles & Bracelets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bangleTypes.map((type, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-[#3e2d26] mb-3">{type.type}</h3>
                <p className="text-gray-700 mb-3">{type.description}</p>
                <div className="space-y-2">
                  <p className="text-sm"><strong className="text-[#D4AF37]">Sizing:</strong> {type.sizing}</p>
                  <p className="text-sm"><strong className="text-green-600">Tip:</strong> {type.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Styling Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Styling & Care Tips</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4">Styling Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">✨</span>
                  Stack multiple thin bangles for a layered look
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">✨</span>
                  Mix metals for a modern, eclectic style
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">✨</span>
                  Balance thick and thin pieces when stacking
                </li>
                <li className="flex items-start">
                  <span className="text-[#D4AF37] mr-2">✨</span>
                  Consider your outfit's neckline when choosing bracelet styles
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-[#3e2d26] mb-4">Care Instructions</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🧼</span>
                  Clean with soft cloth and mild soap solution
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🧼</span>
                  Store separately to prevent scratching
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🧼</span>
                  Remove before swimming or exercising
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">🧼</span>
                  Apply lotions and perfumes before wearing jewelry
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#3e2d26] mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">What's the difference between a bangle and a bracelet?</h3>
              <p className="text-gray-700">Bangles are typically rigid and slip over the hand, while bracelets are flexible with clasps or adjustable openings.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">How many bangles should I wear together?</h3>
              <p className="text-gray-700">This is personal preference! Traditionally, odd numbers (3, 5, 7) are considered auspicious, but wear what feels comfortable and looks good to you.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Can bangles be resized?</h3>
              <p className="text-gray-700">Solid bangles are difficult to resize. Adjustable cuffs and bracelets with clasps offer more flexibility in sizing.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Should I size up or down if I'm between sizes?</h3>
              <p className="text-gray-700">For bangles, size up for easier wearing. For bracelets, consider your preference - size up for loose fit, size down for snug fit.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#3e2d26] mb-2">Do you offer custom sizing?</h3>
              <p className="text-gray-700">Yes! We offer custom sizing for many of our pieces. Contact our customer service team for personalized assistance.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Fit?</h3>
            <p className="text-lg mb-6">Explore our beautiful collection of bangles and bracelets!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="bg-white text-[#D4AF37] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Sizing Help
              </button>
              <button
                onClick={() => navigate('/bracelets')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#D4AF37] transition-colors"
              >
                Shop Bracelets
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
