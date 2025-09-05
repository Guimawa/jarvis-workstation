import ElectronProvider from "@/components/providers/ElectronProvider";

export default function HandshakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElectronProvider>
      <div className="handshake-app electron-app">
        {children}
      </div>
    </ElectronProvider>
  );
}