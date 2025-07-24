import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import api from "../api/axios";

const statusColors = {
  Pending: "bg-gray-100 text-gray-700",
  Approved: "bg-black text-white",
  Rejected: "bg-red-100 text-red-600",
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("All Reviews");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let url = "/reviews";
      if (filter !== "All Reviews") {
        url += `?status=${filter}`;
      }
      const res = await api.get(url);
      setReviews(res.data || []);
    } catch (err) {
      setReviews([]);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await api.patch(`/reviews/${id}/approve`);
    fetchReviews();
  };
  const handleReject = async (id) => {
    await api.patch(`/reviews/${id}/reject`);
    fetchReviews();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Reviews</h1>
        <select
          className="border rounded px-4 py-2"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option>All Reviews</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading reviews...</div>
      ) : (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No reviews found.</div>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    {review.product?.name || "Product"}
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">by {review.user?.name || "User"}</div>
                  <div className="mb-2">{review.comment}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${statusColors[review.status] || "bg-gray-100 text-gray-700"}`}>
                    {review.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    className="flex items-center gap-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
                    onClick={() => handleApprove(review._id)}
                    disabled={review.status === "Approved"}
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    onClick={() => handleReject(review._id)}
                    disabled={review.status === "Rejected"}
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 