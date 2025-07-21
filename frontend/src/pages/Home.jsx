import React from 'react'
import { Link } from 'react-router-dom'
import NewArrivals from '../components/NewArrivals'
import GiftingAndMore from '../components/GiftingAndMore'
import ShopByCategory from '../components/ShopByCategory'
import FeaturedProducts from '../components/FeaturedProducts'
import Footer from '../components/Footer'
import CustomerReviews from '../components/CustomerReviews'

export default function Home() {

  return (
    <div className="min-h-screen w-full bg-white text-[#4a2c2a] relative">


     {/* Hero Section with Local Video */}
<div className="relative min-h-screen bg-[#2d1f1a] text-center flex flex-col justify-center items-center px-6 py-20 overflow-hidden mb-6">
  {/* Background Video */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover z-0"
  >
    <source src="/VIDEO2.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

  {/* Content */}
  <div className="z-10 relative">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 font-serif text-[#fff6ee] drop-shadow">
      Timeless Elegance
    </h1>
    <p className="text-lg md:text-xl text-[#fff6ee]/80 max-w-2xl mb-8">
      Discover our exclusive handcrafted jewelry video experience — where luxury meets legacy.
    </p>
    <div className="flex gap-4 flex-wrap justify-center">
      <Link to="/shop">
        <button className="bg-[#f7c59f] text-[#3e2d26] font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#f39c6b] hover:text-[#3e2d26] transition duration-200">
          Explore Collection →
        </button>
      </Link>
    </div>
  </div>
</div>


      {/* Featured Products */}
      <div className="mb-6">
        <FeaturedProducts />
      </div>
      <div className="mb-6">
        <ShopByCategory />
      </div>
      {/* New Arrivals Section */}
      <div className="mb-6">
        <NewArrivals />
      </div>
      {/* Gifting & More Section */}
      <div className="mb-6">
        <GiftingAndMore />
      </div>
      <div className="mb-6">
        <CustomerReviews />
      </div>
      <Footer />
    </div>
  )
}
