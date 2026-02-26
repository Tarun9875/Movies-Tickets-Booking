// frontend/src/App.tsx
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster
        position="top-center" // 🔥 Middle Top
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#ffffff",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "14px",
            padding: "14px 18px",
            fontSize: "15px", // 🔥 Slightly bigger
            minWidth: "280px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />

      <AppRoutes />
    </div>
  );
}

export default App;
