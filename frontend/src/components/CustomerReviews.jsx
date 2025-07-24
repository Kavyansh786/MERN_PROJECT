import React, { useEffect, useState } from 'react';
import axios from 'axios';

const placeholderImg = 'https://i.pinimg.com/1200x/94/3a/d0/943ad0ad0332b9194e74347ef423efff.jpg';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/reviews?status=Approved');
        setReviews(Array.isArray(res.data) ? res.data : res.data.reviews || []);
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
        <div>
          <pre>{JSON.stringify(reviews, null, 2)}</pre>
          {reviews.length === 0 ? (
            <div>No reviews yet.</div>
          ) : (
            reviews.map((item, index) => (
              <div key={item._id || index} style={{border: '1px solid #ccc', margin: 8, padding: 8}}>
                <div>User: {item.user?.name}</div>
                <div>Product: {item.product?.name}</div>
                <div>Comment: {item.comment}</div>
                <div>Rating: {'★'.repeat(item.rating) + '☆'.repeat(5 - item.rating)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
} 