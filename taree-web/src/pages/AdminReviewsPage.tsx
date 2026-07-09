import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import api from "../lib/api";
import type { Review } from "../types";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data } = await api.get("/admin/reviews?approved=false");
      return data as Review[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/admin/reviews/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height="40px" />
        <Skeleton height="400px" />
      </div>
    );
  }

  const pendingReviews = reviews?.filter((r) => !r.isApproved) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-headline-md text-primary">Review Moderation</h2>
        <Badge variant="warning">{pendingReviews.length} Pending</Badge>
      </div>

      <div className="bg-surface-container border border-outline-variant/10">
        {pendingReviews.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-4" />
            <p className="text-on-surface-variant font-body">All reviews have been moderated.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {pendingReviews.map((review) => (
              <div key={review.id} className="p-6 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-body text-sm text-primary">
                      {review.user.firstName} {review.user.lastName}
                    </span>
                    <span className="text-xs text-on-surface-variant">•</span>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < review.rating ? "text-champagne-gold" : "text-outline-variant"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-display text-sm text-primary mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-sm text-on-surface-variant font-body">{review.comment}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveMutation.mutate(review.id)}
                    isLoading={approveMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
