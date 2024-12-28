"use client"
import React from "react";
import dynamic from 'next/dynamic';
import "./globals.css";
import Script from "next/script";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

const BottomNav = dynamic(() => import('@/app/components/bottom-nav'), { ssr: false });

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/badiihamza/Space/main/tonconnect-manifest.json">
        <html lang="en">
          <head>
            <Script
              src="https://telegram.org/js/telegram-web-app.js"
              strategy="afterInteractive"
            />
          </head>
          <body className="bg-black text-white min-h-screen flex flex-col" suppressHydrationWarning={true}>
            <main className="flex-1">{children}</main>
            <BottomNav />
          </body>
        </html>
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}

