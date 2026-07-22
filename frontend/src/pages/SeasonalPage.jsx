import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const SeasonalPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [seasonalData, setSeasonalData] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchSeasonalData();
  }, [slug]);

  const fetchSeasonalData = async () => {
    try {
      setLoading(true);
      
      // Fetch seasonal page data
      const seasonalResponse = await axios.get(`http://localhost:5000/api/seasonal-page/${slug}`);
      const pageData = seasonalResponse.data.data;
      setSeasonalData(pageData);

      // Fetch products based on filter criteria
      let productQuery = 'http://localhost:5000/api/products?';
      
      // Filter by 'seasonal' categoryPage - all seasonal products use this common category
      productQuery += `categoryPage=seasonal&`;
      
      // Additional filters from seasonal page configuration
      if (pageData.productFilter.category) {
        productQuery += `category=${pageData.productFilter.category}&`;
      }
      
      if (pageData.productFilter.isSpecial) {
        productQuery += `${pageData.productFilter.isSpecial}=true&`;
      }

      console.log('Fetching products with query:', productQuery);
      const productsResponse = await axios.get(productQuery);
      const fetchedProducts = productsResponse.data.products || productsResponse.data || [];
      console.log('Fetched products for seasonal page:', fetchedProducts.length);
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching seasonal data:', error);
      setError('Failed to load seasonal page');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });

    // Sort products
    switch (sortBy) {
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const handleAddToCart = async (productId) => {
    const userId = getUserId();
    if (!userId) {
      showToast({
        type: 'error',
        message: 'Please login to add items to your cart.'
      });
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/cart', {
        user: userId,
        productId,
        quantity: 1,
      });
      showToast({
        type: 'success',
        message: 'Added to cart!'
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      showToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add to cart.'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: seasonalData?.colors?.background ? `linear-gradient(to bottom right, ${seasonalData.colors.background})` : 'linear-gradient(to bottom right, from-rose-50 to-pink-100)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: seasonalData?.colors?.primary || '#dc2626' }}></div>
            <p className="mt-4 text-lg" style={{ color: seasonalData?.colors?.text || '#7f1d1d' }}>Loading {seasonalData?.title || 'Seasonal'} Collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seasonalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error || 'Seasonal page not found'}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { colors } = seasonalData;
  const backgroundStyle = colors.background.includes('gradient') 
    ? { background: colors.background }
    : { background: `linear-gradient(to bottom right, ${colors.background})` };

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-2">
        <h1 
          className="text-4xl md:text-5xl font-extrabold font-serif mb-2 text-left"
          style={{ color: colors.text }}
        >
          {seasonalData.title}
        </h1>
        <p 
          className="text-lg md:text-xl mb-6 text-left max-w-2xl"
          style={{ color: colors.text, opacity: 0.8 }}
        >
          {seasonalData.description}
        </p>
      </section>

      {/* Search and Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5" style={{ color: colors.text, opacity: 0.6 }} />
          </div>
          <input
            type="text"
            placeholder={`Search ${seasonalData.title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent bg-white"
            style={{ 
              borderColor: colors.primary,
              color: colors.text
            }}
            onFocus={(e) => {
              e.target.style.ringColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}40`;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="font-medium" style={{ color: colors.text, opacity: 0.8 }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:border-transparent bg-white"
            style={{ 
              borderColor: colors.primary,
              color: colors.text
            }}
            onFocus={(e) => {
              e.target.style.ringColor = colors.primary;
              e.target.style.boxShadow = `0 0 0 2px ${colors.primary}40`;
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4" style={{ color: colors.primary }}>✨</div>
                <p className="text-lg mb-2" style={{ color: colors.text }}>No {seasonalData.title.toLowerCase()} found</p>
                <p style={{ color: colors.text, opacity: 0.6 }}>Try adjusting your search terms</p>
              </div>
            ) : (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SeasonalPage;
