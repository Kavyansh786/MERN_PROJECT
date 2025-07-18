import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ShopByCategory from '../components/ShopByCategory'
import NewArrivals from '../components/NewArrivals'
import GiftingAndMore from '../components/GiftingAndMore'
import Footer from '../components/Footer'
import { useToast } from '../components/Toast'

export default function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then((res) => {
        setProducts(res.data)
      })
      .catch((err) => console.error('Error fetching products:', err))
  }, [])

  const handleAddToCart = async (productId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'))

    if (!storedUser) {
      showToast({
        type: 'error',
        message: 'Please login to add to cart.',
      })
      navigate('/login')
      return
    }

    try {
      const res = await axios.post('http://localhost:5000/api/cart', {
        userId: storedUser._id,
        productId,
        quantity: 1,
      })

      if (res.data.success) {
        showToast({
          type: 'success',
          message: 'Item added to cart!',
        })
      } else {
        showToast({
          type: 'error',
          message: res.data.message || 'Something went wrong.',
        })
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      showToast({
        type: 'error',
        message: 'Failed to add item to cart.',
      })
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#e9e1de] text-[#fff6ee] relative">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-[#f3ebe8] text-center flex flex-col justify-center items-center px-6 py-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: 'brightness(1.5)' }}
        >
          <source src="/VIDEO2.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

        <div className="z-10 relative">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-serif text-[#fff6ee] drop-shadow">
            Timeless Elegance
          </h1>
          <p className="text-lg md:text-xl text-[#fff6ee]/80 max-w-2xl mb-8">
            Discover our exclusive handcrafted jewelry video experience — where luxury meets legacy.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link to="/shop">
              <button className="bg-[#f7c59f] text-[#3e2d26] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#f39c6b] transition">
                <center> Explore Collection → </center>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-6 py-10 bg-[#fdf8f6]">
        <h2 className="text-2xl font-bold mb-6 text-[#271809] text-center">Featured Products</h2>
        {products.length === 0 ? (
          <p className="text-center text-[#fff6ee]/60">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#fff6ee] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-[#e0c3a0] transition-transform duration-300 hover:scale-105 hover:shadow-2xl group relative"
              >
                <img
                  src={product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-t-2xl border-b-2 border-[#f7c59f]/40"
                />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#3e2d26] mb-2 font-serif">{product.name}</h3>

                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-[#6b3e26] font-semibold">(156)</span>
                  </div>

                  <div className="text-[#6b3e26] text-sm mb-2">
                    <div>Material: <span className="font-medium">{product.material || 'Gold'}</span></div>
                    <div>Category: <span className="font-medium">{product.category || 'Jewelry'}</span></div>
                  </div>

                  <div className="text-3xl font-extrabold text-[#3e2d26] mb-4">₹{product.price}</div>

                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="mt-6 flex items-center justify-center gap-2 bg-[#3e2d26] text-[#fff6ee] font-bold py-2 px-4 rounded-xl shadow-lg hover:bg-[#6b3e26] transition-all duration-300 w-3/4 mx-auto text-base border border-[#e5d5c6]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Sections */}
        <div>
          <ShopByCategory />
          <div className="mt-20"><NewArrivals /></div>
          <GiftingAndMore />
          <Footer />
        </div>
      </div>
    </div>
  )
}
