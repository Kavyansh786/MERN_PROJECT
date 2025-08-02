import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${id}`);
        setProduct(response.data);
        // Set first image as selected
        if (response.data.imageUrl) {
          setSelectedImage(0);
        }
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      fetchRelatedProducts();
      fetchReviews();
      checkWishlistStatus();
    }
  }, [product]);

  const fetchRelatedProducts = async () => {
    try {
      // Fetch products from the same category page
      const response = await axios.get(`/products?categoryPage=${product.categoryPage}&limit=8`);
      // Filter out the current product and limit to 4
      const filteredProducts = response.data
        .filter(p => p._id !== product._id)
        .slice(0, 4);
      setRelatedProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const fetchReviews = async () => {
    try {
      console.log('Fetching reviews for product:', product._id);
      const response = await axios.get(`/reviews/product/${product._id}`);
      console.log('Reviews response:', response.data);
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      console.error('Error response:', err.response?.data);
      // If reviews API doesn't exist, create empty array
      setReviews([]);
    }
  };

  const checkWishlistStatus = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/wishlist/check/${product._id}?userId=${userId}`);
        setIsInWishlist(response.data.isInWishlist);
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    }
  };

  const handleAddToCart = async () => {
    const userId = getUserId();
    
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to add items to your cart.' });
      navigate('/login');
      return;
    }

    // Check if product is out of stock
    if (product.available <= 0) {
      showToast({ type: 'error', message: 'This product is out of stock.' });
      return;
    }

    // Check if quantity exceeds available stock
    if (quantity > product.available) {
      showToast({ type: 'error', message: `Only ${product.available} units available in stock.` });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { 
          user: userId, 
          productId: product._id, 
          quantity: quantity 
        }
      );
      showToast({ type: 'success', message: `${quantity} item(s) added to cart successfully!` });
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast({ type: 'error', message: 'Failed to add to cart.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = async () => {
    const userId = getUserId();
    
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to manage your wishlist.' });
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await axios.delete(`/wishlist/${product._id}?userId=${userId}`);
        setIsInWishlist(false);
        showToast({ type: 'success', message: 'Removed from wishlist!' });
      } else {
        await axios.post('/wishlist', { userId, productId: product._id });
        setIsInWishlist(true);
        showToast({ type: 'success', message: 'Added to wishlist!' });
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      showToast({ type: 'error', message: 'Failed to update wishlist.' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      setShowShareModal(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast({ type: 'success', message: 'Link copied to clipboard!' });
    setShowShareModal(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const userId = getUserId();
    
    if (!userId) {
      showToast({ type: 'error', message: 'Please login to submit a review.' });
      navigate('/login');
      return;
    }

    if (!reviewForm.comment.trim()) {
      showToast({ type: 'error', message: 'Please enter a review comment.' });
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData = {
        userId,
        productId: product._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      };

      console.log('Submitting review data:', reviewData);

      const response = await axios.post('/reviews', reviewData);

      console.log('Review submission response:', response.data);

      if (response.data.success) {
        showToast({ type: 'success', message: 'Review submitted successfully!' });
        setReviewForm({ rating: 5, comment: '' });
        // Refresh reviews
        fetchReviews();
      }
    } catch (error) {
      console.error('Review submission error:', error);
      console.error('Error response:', error.response?.data);
      showToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to submit review.' 
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatus = () => {
    if (product.available <= 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (product.available < 10) return { text: 'Low Stock', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const stockStatus = product ? getStockStatus() : { text: '', color: '', bgColor: '' };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#D4AF37] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center mt-10">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <button onClick={() => navigate('/shop')} className="hover:text-[#D4AF37] transition-colors">
            Shop
          </button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate(`/${product.categoryPage}`)} className="hover:text-[#D4AF37] transition-colors capitalize">
            {product.category}
          </button>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.imageUrl || product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              
              {/* Stock Badge */}
              {product.available <= 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Out of Stock
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 space-y-2">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
                    isInWishlist 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {wishlistLoading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-3xl font-bold text-[#D4AF37] mb-4">{formatPrice(product.price)}</p>
              
              {/* Stock Status */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.color} mb-4`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.color.replace('text-', 'bg-')}`}></div>
                {stockStatus.text}
              </div>

              {/* Reviews Summary */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(calculateAverageRating()) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {calculateAverageRating()} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.available <= 0}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.available, quantity + 1))}
                    disabled={product.available <= 0 || quantity >= product.available}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.available} available
                </span>
              </div>
            </div>

            {/* Stock Information */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Stock Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Stock:</span>
                  <span className={`font-semibold ${product.available <= 0 ? 'text-red-600' : product.available < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {product.available} units
                  </span>
                </div>
                {product.available <= 0 && (
                  <div className="text-red-600 text-sm">
                    This product is currently out of stock. Please check back later.
                  </div>
                )}
                {product.available > 0 && product.available < 10 && (
                  <div className="text-yellow-600 text-sm">
                    Only a few items left in stock!
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium">{product.sku}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
                {product.isRakhi && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rakhi Type:</span>
                    <span className="font-medium capitalize">{product.rakhiType}</span>
                  </div>
                )}
                {product.isFeatured && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className="font-medium text-[#D4AF37]">Yes</span>
                  </div>
                )}
                {product.isNewArrival && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Arrival:</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={handleAddToCart}
                disabled={isLoading || product.available <= 0}
                className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  product.available <= 0 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#a67c52] to-[#7c5c36] text-white hover:from-[#8d6a43] hover:to-[#6b4a2a] transform hover:scale-105'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart...
                  </div>
                ) : product.available <= 0 ? 'Out of Stock' : `Add to Cart - ${formatPrice(product.price * quantity)}`}
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="w-full py-3 px-6 border-2 border-[#D4AF37] text-[#D4AF37] rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
              >
                View Cart
              </button>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Description', icon: '📝' },
                { id: 'details', label: 'Details', icon: 'ℹ️' },
                { id: 'reviews', label: 'Reviews', icon: '⭐' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#D4AF37] text-[#D4AF37]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium capitalize">{product.category}</span>
                    </div>
                    {product.material && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">{product.material}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-[#D4AF37]">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium">{product.available} units</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    {product.isFeatured && (
                      <div className="flex items-center">
                        <span className="text-[#D4AF37] mr-2">⭐</span>
                        <span className="text-gray-600">Featured Product</span>
                      </div>
                    )}
                    {product.isNewArrival && (
                      <div className="flex items-center">
                        <span className="text-green-600 mr-2">🆕</span>
                        <span className="text-gray-600">New Arrival</span>
                      </div>
                    )}
                    {product.isRakhi && (
                      <div className="flex items-center">
                        <span className="text-red-600 mr-2">🎀</span>
                        <span className="text-gray-600">Rakhi Collection</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">📦</span>
                      <span className="text-gray-600">Free Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Write Your Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="text-2xl hover:scale-110 transition-transform"
                          >
                            <span className={star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                        rows="4"
                        placeholder="Share your experience with this product..."
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-3">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.user?.name || 'Anonymous'}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <p className="text-[#D4AF37] font-bold mb-2">{formatPrice(relatedProduct.price)}</p>
                    <button
                      onClick={() => navigate(`/product/${relatedProduct._id}`)}
                      className="w-full bg-[#D4AF37] text-white py-2 px-4 rounded-lg hover:bg-[#B8941F] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Product</h3>
            <div className="space-y-3">
              <button
                onClick={() => copyToClipboard(window.location.href)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Copy Link
              </button>
              <button
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this product: ${product.name} - ${window.location.href}`)}`, '_blank');
                  setShowShareModal(false);
                }}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                Share on WhatsApp
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
