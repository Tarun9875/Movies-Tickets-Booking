// src/routes/ProtectedRoute.tsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface Props {
  children: JSX.Element;
  role?: string;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Role protection (for admin)
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}