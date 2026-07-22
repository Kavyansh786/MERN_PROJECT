import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const placeholderImg = 'https://i.pinimg.com/1200x/94/3a/d0/943ad0ad0332b9194e74347ef423efff.jpg';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/reviews?status=Approved');
        const allReviews = Array.isArray(res.data) ? res.data : res.data.reviews || [];
        // Sort by creation date (newest first) and limit to 6 reviews
        const latestReviews = allReviews
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);
        setReviews(latestReviews);
      } catch (err) {
        setReviews([]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <section className="bg-white text-[#3E2723] py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-[#D4AF37] mb-2">What Our Customers Say</h2>
        <span className="block h-1 w-16 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] rounded-full mx-auto mb-2"></span>
        <p className="text-base mt-2 text-[#8D6E63]">Real stories from our jewelry lovers</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading reviews...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length === 0 ? (
            <div>No reviews yet.</div>
          ) : (
            reviews.map((item, index) => (
              <div
                key={item._id || index}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-start border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={item.user?.profilePic || 'https://i.pinimg.com/1200x/94/3a/d0/943ad0ad0332b9194e74347ef423efff.jpg'}
                    alt={item.user?.name}
                    className="w-12 h-12 rounded-full object-cover mr-3 border"
                  />
                  <div>
                    <div className="font-semibold text-lg">{item.user?.name}</div>
                    <div className="text-sm text-gray-500">{item.product?.name}</div>
                  </div>
                </div>
                <div className="mb-2 text-gray-700 italic">"{item.comment}"</div>
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400 text-lg mr-2">
                    {'★'.repeat(item.rating)}
                    {'☆'.repeat(5 - item.rating)}
                  </span>
                  <span className="text-gray-500 text-sm ml-2">{item.rating}/5</span>
                </div>
                <div className="text-xs text-gray-400 mt-auto">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
} 