import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Skeleton } from "../ui/Skeleton";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-6">
          <Skeleton height="40px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/manage/login" state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
