import { useEffect, useState } from "react";
import api from "../../services/axios";

import PageContainer from "../../components/layout/PageContainer";
import HeroSlider from "../../components/sliders/HeroSlider";
import MovieSlider from "../../components/sliders/MovieSlider";
import Maintenance from "../../components/common/Maintenance";

export default function Home() {

  const [maintenance, setMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= CHECK MAINTENANCE ================= */

  useEffect(() => {

    const checkMaintenance = async () => {

      try {

        // ✅ PUBLIC SETTINGS API
        const res = await api.get("/admin/public-settings");

        setMaintenance(res.data.maintenanceMode);

      } catch (error) {

        console.error("Failed to fetch settings", error);

      } finally {
        setLoading(false);
      }

    };

    checkMaintenance();

  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  /* ================= MAINTENANCE MODE ================= */

  if (maintenance) {
    return <Maintenance />;
  }

  /* ================= NORMAL HOME ================= */

  return (
    <PageContainer>

      {/* HERO SECTION */}
      <HeroSlider />

      {/* MOVIE SECTIONS */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <MovieSlider />
      </section>

    </PageContainer>
  );
}