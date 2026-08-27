import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { CandidateLayout } from '../../layouts/CandidateLayout';
import { Button } from '../../components/Button';
import { Star, MessageSquareQuote } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

export const Feedback = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/candidate/feedback`, 
        { rating, message: feedback },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      toast.success('Thank you for your valuable feedback!');
      setRating(0);
      setFeedback('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text mb-2">Feel it, Say it!</h1>
        <p className="text-gray-500">Share your experience and feedback to help us improve our platform.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <MessageSquareQuote size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">We value your opinion</h2>
            <p className="text-sm text-gray-500">Your feedback helps us create a better experience for everyone.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">How would you rate your overall experience?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(rating)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    size={32} 
                    className={`${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more about your experience</label>
            <textarea
              required
              rows={5}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What did you like? What can we improve?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <Button type="submit" isLoading={submitting} disabled={rating === 0 || !feedback.trim()} className="w-full">
            Submit Feedback
          </Button>
        </form>
      </div>
    </CandidateLayout>
  );
};
