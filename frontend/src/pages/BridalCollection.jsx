import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import { getUserId } from '../utils/userUtils';
import { Heart, ShoppingCart, Star, Filter, Search, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function BridalCollection() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('featured');
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Bridal collection categories
  const categories = [
    { id: 'all', name: 'All Collections', icon: '💎' },
    { id: 'necklace', name: 'Necklaces', icon: '📿' },
    { id: 'earrings', name: 'Earrings', icon: '💍' },
    { id: 'bracelet', name: 'Bracelets', icon: '💫' },
    { id: 'ring', name: 'Rings', icon: '💎' },
    { id: 'tiara', name: 'Tiaras', icon: '👑' },
    { id: 'anklet', name: 'Anklets', icon: '✨' }
  ];

  // Sample bridal collection data
  const bridalProducts = [
    {
      _id: '1',
      name: 'Royal Diamond Necklace Set',
      price: 89999,
      originalPrice: 119999,
      category: 'necklace',
      imageUrl: 'https://i.pinimg.com/736x/cf/87/22/cf87228a1f6a853652c926e8d8ffa348.jpg',
      description: 'Exquisite diamond necklace set perfect for bridal occasions. Features premium diamonds and elegant design.',
      rating: 4.9,
      reviews: 156,
      material: '18K Gold & Diamonds',
      weight: '12.5g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '2',
      name: 'Pearl & Diamond Earrings',
      price: 45999,
      originalPrice: 59999,
      category: 'earrings',
      imageUrl: 'https://i.pinimg.com/1200x/40/62/a4/4062a46d409c992ab041d003e8fce319.jpg',
      description: 'Timeless pearl and diamond earrings. Perfect blend of elegance and sophistication.',
      rating: 4.8,
      reviews: 89,
      material: '14K Gold & Pearls',
      weight: '8.2g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '3',
      name: 'Rose Gold Bridal Ring Set',
      price: 67999,
      originalPrice: 89999,
      category: 'ring',
      imageUrl: 'https://i.pinimg.com/1200x/da/4b/0a/da4b0aef703a7b9662f6e312fd29b817.jpg',
      description: 'Beautiful rose gold ring set with intricate detailing. Perfect for the modern bride.',
      rating: 4.7,
      reviews: 203,
      material: 'Rose Gold & Diamonds',
      weight: '6.8g',
      inStock: true,
      isNew: true,
      isBestseller: false
    },
    {
      _id: '4',
      name: 'Diamond Tennis Bracelet',
      price: 129999,
      originalPrice: 159999,
      category: 'tiara',
      imageUrl: 'https://i.pinimg.com/1200x/c3/1c/9b/c31c9bb638f2675877a6528b25ce4014.jpg',
      description: 'Stunning crystal tiara for the princess bride. Handcrafted with premium crystals.',
      rating: 4.9,
      reviews: 67,
      material: 'Sterling Silver & Crystals',
      weight: '45g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '5',
      name: 'Crystal Tiara Crown',
      price: 78999,
      originalPrice: 99999,
      category: 'bracelet',
      imageUrl: 'https://i.pinimg.com/1200x/17/65/59/1765599fbc9e674ab698ea8f6d707993.jpg',
      description: 'Elegant diamond tennis bracelet. Perfect for adding sparkle to any bridal look.',
      rating: 4.6,
      reviews: 134,
      material: '18K Gold & Diamonds',
      weight: '15.3g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '6',
      name: 'Gold Anklet Set',
      price: 29999,
      originalPrice: 39999,
      category: 'anklet',
      imageUrl: 'https://i.pinimg.com/1200x/cb/e5/94/cbe594dcfd950274cf4e160686552e64.jpg',
      description: 'Traditional gold anklet set with bells. Perfect for traditional Indian bridal wear.',
      rating: 4.5,
      reviews: 78,
      material: '22K Gold',
      weight: '22g',
      inStock: true,
      isNew: false,
      isBestseller: false
    },
    {
      _id: '7',
      name: 'Emerald & Diamond Choker',
      price: 149999,
      originalPrice: 189999,
      category: 'necklace',
      imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop',
      description: 'Luxurious emerald and diamond choker necklace. Perfect for royal bridal occasions.',
      rating: 4.9,
      reviews: 92,
      material: '18K Gold, Emeralds & Diamonds',
      weight: '18.7g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '8',
      name: 'Ruby Drop Earrings',
      price: 67999,
      originalPrice: 89999,
      category: 'earrings',
      imageUrl: 'https://i.pinimg.com/1200x/a4/10/ee/a410ee6797d80c83d50c1122027d040c.jpg',
      description: 'Stunning ruby drop earrings with diamond accents. Timeless elegance for the bride.',
      rating: 4.7,
      reviews: 145,
      material: '14K Gold, Rubies & Diamonds',
      weight: '9.3g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '9',
      name: 'Platinum Wedding Band',
      price: 89999,
      originalPrice: 119999,
      category: 'ring',
      imageUrl: 'https://i.pinimg.com/736x/7c/38/94/7c389427e9e24196b5ae88c4e30d8d97.jpg',
      description: 'Classic platinum wedding band with diamond pave setting. Symbol of eternal love.',
      rating: 4.8,
      reviews: 267,
      material: 'Platinum & Diamonds',
      weight: '4.2g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '10',
      name: 'Sapphire Crown Tiara',
      price: 189999,
      originalPrice: 249999,
      category: 'tiara',
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      description: 'Regal sapphire crown tiara with intricate metalwork. For the queen bride.',
      rating: 4.9,
      reviews: 34,
      material: 'Sterling Silver, Sapphires & Crystals',
      weight: '67g',
      inStock: true,
      isNew: true,
      isBestseller: false
    },
    {
      _id: '11',
      name: 'Gold Chain Bracelet Set',
      price: 45999,
      originalPrice: 59999,
      category: 'bracelet',
      imageUrl: 'https://i.pinimg.com/736x/11/3b/f6/113bf68a2c212b541208d124dc9e65e0.jpg',
      description: 'Traditional gold chain bracelet set with traditional motifs. Perfect for cultural ceremonies.',
      rating: 4.6,
      reviews: 189,
      material: '22K Gold',
      weight: '28.5g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '12',
      name: 'Silver Anklet with Bells',
      price: 15999,
      originalPrice: 19999,
      category: 'anklet',
      imageUrl: 'https://i.pinimg.com/736x/db/e8/91/dbe891ee4e78ac2bbf3a0df466181b20.jpg',
      description: 'Delicate silver anklet with traditional bells. Perfect for traditional bridal wear.',
      rating: 4.4,
      reviews: 112,
      material: 'Sterling Silver',
      weight: '12.8g',
      inStock: true,
      isNew: false,
      isBestseller: false
    },
    {
      _id: '13',
      name: 'Diamond Pendant Necklace',
      price: 78999,
      originalPrice: 99999,
      category: 'necklace',
      imageUrl: 'https://i.pinimg.com/736x/53/02/32/530232819741b195c3a554772f4a3729.jpg',
      description: 'Elegant diamond pendant necklace with chain. Versatile for any bridal occasion.',
      rating: 4.8,
      reviews: 203,
      material: '18K Gold & Diamonds',
      weight: '8.9g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '14',
      name: 'Pearl Stud Earrings',
      price: 29999,
      originalPrice: 39999,
      category: 'earrings',
      imageUrl: 'https://i.pinimg.com/1200x/46/97/36/46973678ea27b617a4d2a013752c578e.jpg',
      description: 'Classic pearl stud earrings with gold setting. Timeless elegance for the bride.',
      rating: 4.7,
      reviews: 178,
      material: '14K Gold & Freshwater Pearls',
      weight: '3.2g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '15',
      name: 'Rose Gold Eternity Ring',
      price: 99999,
      originalPrice: 129999,
      category: 'ring',
      imageUrl: 'https://i.pinimg.com/1200x/89/a9/38/89a9385a4b75508187bd9a70586a63f1.jpg',
      description: 'Beautiful rose gold eternity ring with diamond band. Symbol of endless love.',
      rating: 4.9,
      reviews: 156,
      material: 'Rose Gold & Diamonds',
      weight: '5.7g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '16',
      name: 'Crystal Flower Tiara',
      price: 89999,
      originalPrice: 119999,
      category: 'tiara',
      imageUrl: 'https://i.pinimg.com/736x/61/7e/1c/617e1c1fd668f007cd7ab09581b2b28a.jpg',
      description: 'Delicate crystal flower tiara with vintage design. Perfect for romantic bridal looks.',
      rating: 4.6,
      reviews: 89,
      material: 'Sterling Silver & Swarovski Crystals',
      weight: '38g',
      inStock: true,
      isNew: false,
      isBestseller: false
    },
    {
      _id: '17',
      name: 'Diamond Bangle Set',
      price: 129999,
      originalPrice: 169999,
      category: 'bracelet',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      description: 'Luxurious diamond bangle set with intricate design. Perfect for special bridal moments.',
      rating: 4.8,
      reviews: 134,
      material: '18K Gold & Diamonds',
      weight: '22.3g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '18',
      name: 'Gold Anklet with Stones',
      price: 39999,
      originalPrice: 49999,
      category: 'anklet',
      imageUrl: 'https://i.pinimg.com/1200x/b4/7d/be/b47dbea17a1e596425eac193a8b3aa4b.jpg',
      description: 'Elegant gold anklet with precious stones. Perfect for traditional and modern bridal wear.',
      rating: 4.5,
      reviews: 95,
      material: '18K Gold & Precious Stones',
      weight: '16.7g',
      inStock: true,
      isNew: false,
      isBestseller: false
    },
    {
      _id: '19',
      name: 'Sapphire & Diamond Necklace',
      price: 169999,
      originalPrice: 219999,
      category: 'necklace',
      imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop',
      description: 'Stunning sapphire and diamond necklace. Royal elegance for the special bride.',
      rating: 4.9,
      reviews: 78,
      material: '18K Gold, Sapphires & Diamonds',
      weight: '24.1g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '20',
      name: 'Emerald Drop Earrings',
      price: 89999,
      originalPrice: 119999,
      category: 'earrings',
      imageUrl: 'https://i.pinimg.com/1200x/e2/a6/44/e2a644e620a7a7fb4ec81dc1fb005593.jpg',
      description: 'Luxurious emerald drop earrings with diamond accents. Perfect for the sophisticated bride.',
      rating: 4.8,
      reviews: 112,
      material: '18K Gold, Emeralds & Diamonds',
      weight: '11.4g',
      inStock: true,
      isNew: true,
      isBestseller: false
    },
    {
      _id: '21',
      name: 'White Gold Solitaire Ring',
      price: 149999,
      originalPrice: 199999,
      category: 'ring',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      description: 'Classic white gold solitaire ring with brilliant cut diamond. The perfect engagement ring.',
      rating: 4.9,
      reviews: 289,
      material: 'White Gold & Diamond',
      weight: '3.8g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '22',
      name: 'Diamond Crown Tiara',
      price: 249999,
      originalPrice: 299999,
      category: 'tiara',
      imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop',
      description: 'Magnificent diamond crown tiara. The ultimate bridal accessory for the royal bride.',
      rating: 5.0,
      reviews: 23,
      material: '18K Gold & Diamonds',
      weight: '89g',
      inStock: true,
      isNew: true,
      isBestseller: true
    },
    {
      _id: '23',
      name: 'Pearl & Gold Bracelet',
      price: 55999,
      originalPrice: 69999,
      category: 'bracelet',
      imageUrl: 'https://i.pinimg.com/736x/c2/16/2b/c2162b45689ba114446f31e4a192e038.jpg',
      description: 'Elegant pearl and gold bracelet with delicate design. Perfect for the graceful bride.',
      rating: 4.7,
      reviews: 167,
      material: '18K Gold & Freshwater Pearls',
      weight: '14.2g',
      inStock: true,
      isNew: false,
      isBestseller: true
    },
    {
      _id: '24',
      name: 'Silver Anklet with Gems',
      price: 22999,
      originalPrice: 29999,
      category: 'anklet',
      imageUrl: 'https://i.pinimg.com/1200x/c1/11/6c/c1116c7d582420116db1cfce81332439.jpg',
      description: 'Beautiful silver anklet with colorful gemstones. Perfect for the vibrant bride.',
      rating: 4.6,
      reviews: 134,
      material: 'Sterling Silver & Gemstones',
      weight: '18.9g',
      inStock: true,
      isNew: true,
      isBestseller: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In real app, this would be: const response = await axios.get('http://localhost:5000/api/products/bridal');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
        setProducts(bridalProducts);
        setFilteredProducts(bridalProducts);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bridal collection:', err);
        setError('Failed to load bridal collection.');
        showToast({
          type: 'error',
          message: 'Failed to load bridal collection.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [showToast]);

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
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
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

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

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    const isInWishlist = wishlist.includes(productId);
    showToast({
      type: isInWishlist ? 'info' : 'success',
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!'
    });
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-rose-800 text-lg">Loading Bridal Collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f6]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-[#3e2d26] mb-2 text-left">Bridal Collection</h1>
        <p className="text-lg md:text-xl text-[#8D6E63] mb-6 text-left max-w-2xl">Discover our exclusive bridal jewelry collection — where dreams meet elegance. Every piece tells a story of love and tradition.</p>
      </section>

      {/* Filter/Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 items-center">
          <button className="border border-[#D4AF37] text-[#3e2d26] font-semibold rounded-lg px-5 py-2.5 bg-white hover:bg-[#f7e1c7] transition-all flex items-center gap-2">
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            Filters
          </button>
        </div>
        <div className="flex gap-2 items-center">
          {/* Grid/List Toggle (Grid active) */}
          <button className="border border-[#D4AF37] bg-[#D4AF37] text-white rounded-lg px-3 py-2 flex items-center focus:outline-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
          <button className="border border-[#D4AF37] text-[#3e2d26] rounded-lg px-3 py-2 flex items-center focus:outline-none bg-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="4"/><rect x="3" y="10" width="18" height="4"/><rect x="3" y="16" width="18" height="4"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[#8D6E63] font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#D4AF37] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-[#3e2d26] bg-white"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </div>
            </div>
  );
  }