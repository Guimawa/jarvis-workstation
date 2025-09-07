import "./globals.css";
import { Inter } from "next/font/google";
import ElectronProvider from "@/components/providers/ElectronProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JARVIS Ultra Instinct - Handshake Dashboard",
  description: "Dashboard IA complet avec interface Handshake Advanced - Version Electron",
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} electron-app handshake-root`}
      >
        <ElectronProvider>
          {/* Interface Handshake Advanced en plein écran */}
          <div className="min-h-screen w-full">
            {children}
          </div>
        </ElectronProvider>
      </body>
    </html>
  );
}
