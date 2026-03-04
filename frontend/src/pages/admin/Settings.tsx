import { useEffect, useState } from "react";
import api from "../../services/axios";
import { toast } from "react-toastify";

interface SettingsData {
  theatreName: string;
  theatreLocation: string;
  vipPrice: number;
  premiumPrice: number;
  executivePrice: number;
  normalPrice: number;
  bookingTimeLimit: number;
  maintenanceMode: boolean;
  currency: string;
}

export default function AdminSettings() {

  const [settings, setSettings] = useState<SettingsData>({
    theatreName: "Ruchu Cinemas",
    theatreLocation: "Surat",
    vipPrice: 500,
    premiumPrice: 250,
    executivePrice: 230,
    normalPrice: 210,
    bookingTimeLimit: 5,
    maintenanceMode: false,
    currency: "INR",
  });

  const [loading, setLoading] = useState(false);

  /* ================= LOAD SETTINGS ================= */

  useEffect(() => {

    const fetchSettings = async () => {
      try {

        setLoading(true);

        const res = await api.get("/admin/settings");

        setSettings(res.data);

      } catch (error) {

        toast.error("Failed to load settings");

      } finally {
        setLoading(false);
      }
    };

    fetchSettings();

  }, []);

  /* ================= SAVE SETTINGS ================= */

  const handleSave = async () => {

    try {

      setLoading(true);

      await api.put("/admin/settings", settings);

      toast.success("Settings updated successfully");

    } catch (error) {

      toast.error("Failed to save settings");

    } finally {
      setLoading(false);
    }

  };

  const handleChange = (field: keyof SettingsData, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div style={{ color: "var(--text-color)" }}>
      <h1 className="text-3xl font-bold mb-8">⚙ Admin Settings</h1>

      {loading && (
        <p className="mb-4 text-gray-500">Loading settings...</p>
      )}

      {/* THEATRE INFO */}
      <div className="settings-card">
        <h2 className="settings-title">🏢 Theatre Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <InputField
            label="Theatre Name"
            value={settings.theatreName}
            onChange={(v:any) => handleChange("theatreName", v)}
          />

          <InputField
            label="Location"
            value={settings.theatreLocation}
            onChange={(v:any) => handleChange("theatreLocation", v)}
          />
        </div>
      </div>

      {/* PRICING */}
      <div className="settings-card">
        <h2 className="settings-title">🎟 Ticket Pricing</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <InputField
            label="VIP Price"
            type="number"
            value={settings.vipPrice}
            onChange={(v:any) => handleChange("vipPrice", Number(v))}
          />

          <InputField
            label="Premium Price"
            type="number"
            value={settings.premiumPrice}
            onChange={(v:any) => handleChange("premiumPrice", Number(v))}
          />

          <InputField
            label="Executive Price"
            type="number"
            value={settings.executivePrice}
            onChange={(v:any) => handleChange("executivePrice", Number(v))}
          />

          <InputField
            label="Normal Price"
            type="number"
            value={settings.normalPrice}
            onChange={(v:any) => handleChange("normalPrice", Number(v))}
          />

        </div>
      </div>

      {/* BOOKING RULES */}
      <div className="settings-card">
        <h2 className="settings-title">⏳ Booking Rules</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <InputField
            label="Seat Hold Time (minutes)"
            type="number"
            value={settings.bookingTimeLimit}
            onChange={(v:any) =>
              handleChange("bookingTimeLimit", Number(v))
            }
          />

          <div>
            <label className="block mb-2">Currency</label>

            <select
              value={settings.currency}
              onChange={(e) =>
                handleChange("currency", e.target.value)
              }
              className="settings-input"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>

          </div>

        </div>
      </div>

      {/* SYSTEM SETTINGS */}
      <div className="settings-card">
        <h2 className="settings-title">🛠 System Settings</h2>

        <div className="flex items-center justify-between">

          <span>Maintenance Mode</span>

          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) =>
              handleChange("maintenanceMode", e.target.checked)
            }
            className="w-5 h-5"
          />

        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-8">

        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 rounded-lg"
          style={{
            backgroundColor: "#dc2626",
            color: "#fff",
          }}
        >
          Save Settings
        </button>

      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: any) {

  return (
    <div>

      <label className="block mb-2">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="settings-input"
      />

    </div>
  );
}