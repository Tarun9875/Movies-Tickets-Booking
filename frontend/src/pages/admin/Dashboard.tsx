// frontend/src/pages/admin/Dashboard.tsx

import { useEffect, useState } from "react";
import api from "../../services/axios";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaRupeeSign,
  FaTicketAlt,
  FaFilm,
  FaUsers,
  FaTheaterMasks
} from "react-icons/fa";

interface Booking {
  _id: string;
  movieTitle: string;
  totalAmount: number;
  status: string;
  user?: {
    name: string;
    email: string;
  };
}

interface DashboardData {
  overview: {
    totalMovies: number;
    totalUsers: number;
    totalShows: number;
    totalRevenue: number;
    totalBookings: number;
    seatOccupancy?: number;
    revenueGrowth?: number;
    peakShowTime?: string;
  };
  monthlyRevenue: { _id: { month: number }; revenue: number }[];
  bookingStatus: { _id: string; count: number }[];
  topMovies: { _id: string; revenue: number }[];
  recentBookings: Booking[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("month");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/dashboard?range=${range}`);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [range]);

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(amount);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  const monthNames = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  /* ================= EXPORT ================= */

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Ruchu Cinemas Business Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["User", "Movie", "Amount", "Status"]],
      body: data.recentBookings.map((b) => [
        b.user?.name ?? "User",
        b.movieTitle,
        formatINR(b.totalAmount),
        b.status
      ])
    });

    doc.save("dashboard-report.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.recentBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dashboard");
    XLSX.writeFile(workbook, "dashboard-report.xlsx");
  };

  const exportCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(data.recentBookings);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "dashboard-report.csv");
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--primary-color)]">
          🎬 Ruchu Cinemas Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border-color)]"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>

          <ExportButton onClick={exportPDF} color="bg-red-500 hover:bg-red-600">
            <FaFilePdf /> PDF
          </ExportButton>

          <ExportButton onClick={exportExcel} color="bg-green-600 hover:bg-green-700">
            <FaFileExcel /> Excel
          </ExportButton>

          <ExportButton onClick={exportCSV} color="bg-blue-600 hover:bg-blue-700">
            <FaFileCsv /> CSV
          </ExportButton>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard icon={<FaRupeeSign />} title="Revenue"
          value={data.overview.totalRevenue} format={formatINR} />

        <StatCard icon={<FaTicketAlt />} title="Bookings"
          value={data.overview.totalBookings} />

        <StatCard icon={<FaFilm />} title="Movies"
          value={data.overview.totalMovies} />

        <StatCard icon={<FaTheaterMasks />} title="Shows"
          value={data.overview.totalShows} />

        <StatCard icon={<FaUsers />} title="Users"
          value={data.overview.totalUsers} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="card-title">📈 Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyRevenue}>
              <XAxis
                dataKey="_id.month"
                tickFormatter={(m: number) =>
                  monthNames[(m ?? 1) - 1]
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="card-title">🎟 Booking Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.bookingStatus}
                dataKey="count"
                nameKey="_id"
                outerRadius={100}
              >
                {data.bookingStatus.map((entry, index) => (
                  <Cell key={entry._id} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP MOVIES */}
      <div className="card">
        <h2 className="card-title">🎬 Top Movies</h2>
        {data.topMovies.map((movie) => (
          <div
            key={movie._id}
            className="flex justify-between p-3 bg-[var(--hover-bg)] rounded-lg mb-2"
          >
            <span>{movie._id}</span>
            <span>{formatINR(movie.revenue)}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function ExportButton({ children, onClick, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 shadow-md hover:scale-105 ${color}`}
    >
      {children}
    </button>
  );
}

function StatCard({ icon, title, value, format }: any) {
  return (
    <div className="rounded-xl p-5 border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm opacity-70">{title}</p>
        <div className="p-2 rounded-full bg-gray-200 text-gray-700">
          {icon}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[var(--primary-color)]">
        {format ? format(value) : <CountUp end={value || 0} duration={2} />}
      </h2>
    </div>
  );
}