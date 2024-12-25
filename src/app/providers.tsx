'use client'

import { TonConnectUIProvider } from "@tonconnect/ui-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/badiihamza/Space/main/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}

