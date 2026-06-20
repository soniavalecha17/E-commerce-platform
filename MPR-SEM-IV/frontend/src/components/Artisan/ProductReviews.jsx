import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';

const ProductReviews = ({ existingReviews = [], onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');

  // Calculate rating statistics safely
  const totalReviews = existingReviews.length;
  const averageRating = totalReviews > 0 
    ? (existingReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  // Calculate percentages for each star row
  const getStarPercentage = (starNum) => {
    if (totalReviews === 0) return 0;
    const count = existingReviews.filter(r => Math.round(r.rating) === starNum).length;
    return Math.round((count / totalReviews) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating star level.");
      return;
    }
    if (!customerName.trim() || !reviewText.trim()) {
      alert("Please fill out both your name and review text field.");
      return;
    }

    onAddReview({
      customer_name: customerName,
      rating: rating,
      review_text: reviewText
    });

    // Reset Form Fields
    setCustomerName('');
    setReviewText('');
    setRating(0);
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100">
      {/* Component Title Header */}
      <div className="flex items-center gap-2 text-gray-800 font-bold text-xl mb-6 border-b border-gray-50 pb-3">
        <MessageSquare className="text-[#2D6A4F]" size={22} />
        <h2>Customer Reviews & Ratings</h2>
      </div>

      {/* Main Grid Layout Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 items-start">
        
        {/* Left Card Column: Total Avg Score Badge */}
        <div className="bg-gray-50/60 rounded-2xl p-6 text-center border border-gray-100/50 flex flex-col items-center justify-center min-h-[180px]">
          <span className="text-5xl font-black text-gray-900 tracking-tight mb-2">{averageRating}</span>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                size={18} 
                className={`${star <= Math.round(Number(averageRating)) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} 
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{totalReviews} Total Reviews</p>
        </div>

        {/* Middle Column: Star Count Progress Bars */}
        <div className="space-y-2.5 pt-2">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const percentage = getStarPercentage(starNum);
            return (
              <div key={starNum} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                <span className="w-3 text-right">{starNum}</span>
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-gray-400 font-bold">{percentage}%</span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Submit Feedback Interactive Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50/30 p-4 rounded-2xl border border-gray-100/40">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Rating</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent shadow-sm transition-all"
            />
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write feedback..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent shadow-sm transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2D6A4F] text-white font-bold rounded-xl text-sm hover:bg-[#1B4332] active:scale-[0.98] transition-all shadow-md shadow-emerald-900/10"
          >
            Submit Feedback
          </button>
        </form>

      </div>

      {/* Bottom Section: Past Reviews Render Feed */}
      <div className="mt-6 border-t border-gray-50 pt-6">
        {existingReviews.length === 0 ? (
          <p className="text-center text-sm font-medium text-gray-400 py-6">
            No reviews yet. Be the first to leave one!
          </p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {existingReviews.map((rev, index) => (
              <div key={rev._id || index} className="bg-gray-50/40 border border-gray-100 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-gray-800 text-sm">{rev.customer_name}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={12} 
                        className={`${star <= rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">{rev.review_text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;