import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
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

type FormatType = "CSV" | "JSON";

export default function AdminReports() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [movieRevenue, setMovieRevenue] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [format, setFormat] = useState<FormatType>("CSV");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const chartRef = useRef<any>(null);

  /* ================= FETCH FROM BACKEND ================= */

  const fetchReports = async () => {
    const res = await api.get("/admin/reports", {
      params: { startDate, endDate }
    });

    setBookings(res.data.bookings);
    setMovieRevenue(res.data.movieRevenue);
    setTrend(res.data.trend);
    setTotalRevenue(res.data.totalRevenue);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  /* ================= CHART DATA ================= */

  const barData = {
    labels: movieRevenue.map((m) => m._id),
    datasets: [
      {
        label: "Revenue",
        data: movieRevenue.map((m) => m.revenue),
        backgroundColor: "#dc2626",
      },
    ],
  };

  const lineData = {
    labels: trend.map((t) => t._id),
    datasets: [
      {
        label: "Revenue Trend",
        data: trend.map((t) => t.revenue),
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
      },
    ],
  };

  /* ================= DOWNLOAD ================= */

  const downloadFile = () => {
    let content = "";

    if (format === "JSON") {
      content = JSON.stringify(bookings, null, 2);
    } else {
      content = "BookingID,Movie,Amount,Date\n";
      content += bookings
        .map(
          (b) =>
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
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Reports</h1>

        <div className="flex gap-3 items-center">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as FormatType)}
            className="px-3 py-2 rounded-lg border"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>

          <button
            onClick={downloadFile}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* TOTAL */}
      <div className="text-xl font-semibold">
        Total Revenue: ₹{totalRevenue}
      </div>

      {/* BAR CHART */}
      <div className="card p-6">
        <Bar ref={chartRef} data={barData} />
      </div>

      {/* LINE CHART */}
      <div className="card p-6">
        <Line data={lineData} />
      </div>

    </div>
  );
}