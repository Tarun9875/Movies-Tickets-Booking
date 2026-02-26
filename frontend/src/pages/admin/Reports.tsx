// frontend/src/pages/admin/Reports.tsx

import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import {
  Bar,
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../services/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Booking {
  _id: string;
  movieTitle?: string;
  totalAmount: number;
  createdAt: string;
}

type FormatType = "CSV" | "EXCEL" | "TXT" | "JSON";

export default function AdminReports() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [format, setFormat] = useState<FormatType>("CSV");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const chartRef = useRef<any>(null);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data.bookings);
        setFiltered(res.data.bookings);
      } catch {
        const demo = [
          { _id: "1", movieTitle: "Avengers", totalAmount: 500, createdAt: new Date().toISOString() },
          { _id: "2", movieTitle: "Jawan", totalAmount: 700, createdAt: new Date().toISOString() },
          { _id: "3", movieTitle: "Avengers", totalAmount: 300, createdAt: new Date().toISOString() },
        ];
        setBookings(demo);
        setFiltered(demo);
      }
    };
    fetchData();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    let data = bookings;

    if (startDate) {
      data = data.filter(b => new Date(b.createdAt) >= new Date(startDate));
    }

    if (endDate) {
      data = data.filter(b => new Date(b.createdAt) <= new Date(endDate));
    }

    setFiltered(data);
  }, [startDate, endDate, bookings]);

  // ================= CALCULATIONS =================
  const totalRevenue = filtered.reduce((s, b) => s + b.totalAmount, 0);

  const movieRevenueMap: Record<string, number> = {};
  filtered.forEach(b => {
    const title = b.movieTitle || "Unknown";
    movieRevenueMap[title] = (movieRevenueMap[title] || 0) + b.totalAmount;
  });

  const chartData = {
    labels: Object.keys(movieRevenueMap),
    datasets: [
      {
        label: "Revenue",
        data: Object.values(movieRevenueMap),
        backgroundColor: "#dc2626",
      },
    ],
  };

  const trendData = {
    labels: filtered.map(b => new Date(b.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Booking Trend",
        data: filtered.map(b => b.totalAmount),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
      },
    ],
  };

  // ================= DOWNLOAD =================
  const downloadFile = () => {
    const chartImage = chartRef.current?.toBase64Image();

    let content = "";

    if (format === "JSON") {
      content = JSON.stringify(filtered, null, 2);
    } else {
      content = "BookingID,Movie,Amount,Date\n";
      content += filtered
        .map(
          b =>
            `${b._id},${b.movieTitle},${b.totalAmount},${new Date(
              b.createdAt
            ).toLocaleString()}`
        )
        .join("\n");
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${format.toLowerCase()}`;
    a.click();

    URL.revokeObjectURL(url);

    // Download Chart as Image
    if (chartImage) {
      const link = document.createElement("a");
      link.href = chartImage;
      link.download = "chart.png";
      link.click();
    }
  };

  return (
    <div style={{ color: "var(--text-color)" }}>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📊 Reports</h1>

        <div className="flex gap-3 items-center">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatType)}
            className="px-3 py-2 rounded-lg"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
            }}
          >
            <option value="CSV">CSV</option>
            <option value="EXCEL">Excel</option>
            <option value="TXT">Text</option>
            <option value="JSON">JSON</option>
          </select>

          <button
            onClick={downloadFile}
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div
        className="p-4 rounded-xl mb-8 flex gap-4 flex-wrap"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 rounded-lg"
        />
      </div>

      {/* TOTAL */}
      <div className="mb-8 text-xl font-semibold">
        Total Revenue: ₹{totalRevenue}
      </div>

      {/* BAR CHART */}
      <div
        className="p-6 rounded-xl mb-10"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <Bar ref={chartRef} data={chartData} />
      </div>

      {/* LINE CHART */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <Line data={trendData} />
      </div>
    </div>
  );
}