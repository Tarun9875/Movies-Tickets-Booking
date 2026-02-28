// src/routes/AppRoutes.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Movies from "../pages/customer/Movies";
import MovieDetails from "../pages/customer/MovieDetails";
import MovieShows from "../pages/customer/MovieShows";
import SeatSelection from "../pages/customer/SeatSelection";
import Payment from "../pages/customer/Payment";
import MyBookings from "../pages/customer/MyBookings";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import NewPassword from "../pages/auth/NewPassword";

import Contact from "../pages/customer/Contact";
import About from "../pages/customer/About";

import Ticket from "../pages/customer/Ticket";

// ================= ADMIN =================
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminMovies from "../pages/admin/Movies";
import AddMovie from "../pages/admin/AddMovie";
import EditMovie from "../pages/admin/EditMovie";
import AdminMovieDetailForm from "../pages/admin/MovieDetail";

import AdminShows from "../pages/admin/Shows";
import AddShow from "../pages/admin/AddShow";
import EditShow from "../pages/admin/EditShow";
import ShowSeats from "../pages/admin/ShowSeats";

import AdminBookings from "../pages/admin/Bookings";
import AdminUsers from "../pages/admin/Users";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";

import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../pages/errors/Unauthorized";
import NotFound from "../pages/errors/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* ✅ FIXED PARAM NAME HERE */}
        <Route path="/movies/:movieId/shows" element={<MovieShows />} />

        {/* ================= BOOKING FLOW ================= */}
        <Route
          path="/shows/:showId/seats"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:showId"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings/:bookingId"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password/:token" element={<NewPassword />} />

        {/* ================= CUSTOMER PAGES ================= */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

       {/*  /// ================= TICKET ================= */}
       <Route
          path="/ticket"
          element={
            <ProtectedRoute>
              <Ticket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket/:bookingId"
          element={
            <ProtectedRoute>
              <Ticket />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="movies" element={<AdminMovies />} />
          <Route path="movies/add" element={<AddMovie />} />
          <Route path="movies/edit/:id" element={<EditMovie />} />
          <Route path="movies/:id/details" element={<AdminMovieDetailForm />} />

          <Route path="shows" element={<AdminShows />} />
          <Route path="shows/add" element={<AddShow />} />
          <Route path="shows/edit/:id" element={<EditShow />} />
          <Route path="shows/:showId/seats" element={<ShowSeats />} />

          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ================= ERRORS ================= */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}