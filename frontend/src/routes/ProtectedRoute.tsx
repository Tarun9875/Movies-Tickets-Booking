import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role?: string;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role)
    return <Navigate to="/" />;

  return <>{children}</>;
}
