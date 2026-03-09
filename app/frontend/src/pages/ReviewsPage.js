import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import axios from 'axios';
import { API } from '../app';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen py-24 px-6" data-testid="reviews-page">
      <div className="max-w-[90vw] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">Client Reviews</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Real experiences from our valued clients
          </p>

          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block glass-heavy rounded-sm px-8 py-6"
              data-testid="rating-summary"
            >
              <div className="flex items-center justify-center space-x-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={`${
                      i < Math.round(averageRating)
                        ? 'fill-primary text-primary'
                        : 'text-border'
                    }`}
                  />
                ))}
              </div>
              <p className="text-3xl font-serif font-semibold text-primary mb-1">{averageRating}</p>
              <p className="text-sm text-muted-foreground">Average rating from {reviews.length} reviews</p>
            </motion.div>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12" data-testid="no-reviews">
            <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="glass rounded-sm p-8"
                data-testid={`review-card-${index}`}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'fill-primary text-primary'
                          : 'text-border'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{review.comment}"
                </p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold mb-1">{review.client_name}</p>
                  <p className="text-sm text-primary">{review.service_name}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}