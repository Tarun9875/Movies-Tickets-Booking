// frontend/src/pages/customer/Home.tsx

import PageContainer from "../../components/layout/PageContainer";
import HeroSlider from "../../components/sliders/HeroSlider";
import MovieSlider from "../../components/sliders/MovieSlider";

export default function Home() {
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