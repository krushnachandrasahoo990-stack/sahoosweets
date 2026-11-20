import React, { useState } from 'react';
import { X, Star, ThumbsUp, CheckCircle2 } from 'lucide-react';

interface SwiggyRatingModalProps {
  order: any;
  onClose: () => void;
  onSubmit: (orderId: string, rating: number, feedback: string) => void;
}

export const SwiggyRatingModal: React.FC<SwiggyRatingModalProps> = ({ order, onClose, onSubmit }) => {
  const [foodRating, setFoodRating] = useState<number>(5);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Fresh & Authentic', 'Quick Delivery']);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const tags = [
    'Fresh & Authentic',
    'Perfect Sweetness',
    'Quick Delivery',
    'Safe Packaging',
    'Polite Valet',
    'Hot & Spongy'
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(order.id, foodRating, comment);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 p-6 space-y-5 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Thank You for Your Feedback!</h3>
            <p className="text-xs text-gray-500">Your review helps Sahoo Sweets maintain top quality.</p>
          </div>
        ) : (
          <>
            <div className="border-b pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Swiggy Order Experience</span>
              <h3 className="text-lg font-black text-gray-900 mt-1">Rate Your Order • {order.id}</h3>
              <p className="text-xs text-gray-500">{order.items}</p>
            </div>

            {/* Food Rating */}
            <div className="space-y-2 text-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-700">How were the sweets & snacks?</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFoodRating(star)}
                    className="p-1 transition-transform hover:scale-125 cursor-pointer"
                  >
                    <Star 
                      className={`w-7 h-7 ${star <= foodRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] font-extrabold text-amber-600">
                {foodRating === 5 ? 'Delicious! ⭐⭐⭐⭐⭐' : foodRating === 4 ? 'Very Good! ⭐⭐⭐⭐' : foodRating === 3 ? 'Good ⭐⭐⭐' : 'Needs Improvement'}
              </p>
            </div>

            {/* Delivery Partner Rating */}
            <div className="space-y-2 text-center bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-bold text-gray-900">Delivery Valet: Ramesh Kumar</p>
                  <p className="text-[10px] text-gray-500">Delivered with hygiene & care</p>
                </div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setDeliveryRating(star)}
                      className="cursor-pointer"
                    >
                      <Star 
                        className={`w-4 h-4 ${star <= deliveryRating ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick compliments */}
            <div>
              <p className="text-[11px] font-bold text-gray-600 mb-2">What went great?</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      selectedTags.includes(tag) 
                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm' 
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {selectedTags.includes(tag) ? '✓ ' : '+ '} {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback for Sahoo Sweets kitchen..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition resize-none h-20"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Submit Rating</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SwiggyRatingModal;
