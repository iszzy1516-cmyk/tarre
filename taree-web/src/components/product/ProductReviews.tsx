import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, Send } from "lucide-react";
import api from "../../lib/api";
import type { Review } from "../../types";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/products/${productId}`);
      return data as Review[];
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: { rating: number; title: string; comment: string }) => {
      await api.post(`/reviews/products/${productId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setRating(5);
      setTitle("");
      setComment("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({ rating, title, comment });
  };

  return (
    <div className="space-y-8">
      <h3 className="font-display text-headline-sm text-primary">Customer Reviews</h3>

      {/* Review List */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-20 bg-surface-container animate-pulse" />
          <div className="h-20 bg-surface-container animate-pulse" />
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-outline-variant/10 pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-champagne-gold fill-champagne-gold" : "text-outline-variant"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-body text-on-surface-variant">
                  {review.user.firstName} {review.user.lastName}
                </span>
              </div>
              {review.title && (
                <h4 className="font-display text-sm text-primary mb-1">{review.title}</h4>
              )}
              {review.comment && (
                <p className="text-sm text-on-surface-variant font-body">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-on-surface-variant font-body">No reviews yet. Be the first to review this product.</p>
      )}

      {/* Submit Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="bg-surface-container p-6 space-y-4">
          <h4 className="font-display text-sm text-primary">Write a Review</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm font-body text-primary">Rating:</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      i < rating ? "text-champagne-gold fill-champagne-gold" : "text-outline-variant"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-body text-primary">Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full bg-surface-container border border-outline-variant text-primary px-4 py-3 text-sm font-body placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors"
              placeholder="Share your thoughts about this product..."
            />
          </div>
          <Button type="submit" isLoading={submitMutation.isPending}>
            <Send className="w-4 h-4" />
            Submit Review
          </Button>
        </form>
      ) : (
        <p className="text-sm text-on-surface-variant font-body">
          Please <a href="/login" className="text-secondary hover:underline">log in</a> to write a review.
        </p>
      )}
    </div>
  );
}
