//frontend/src/components/layout/PageContainer.tsx
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: React.ReactNode;
}
export default function PageContainer({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
