// frontend/src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mini CRM",
  description: "Internal CRM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#f5f5f5",
        }}
      >
        <header
          style={{
            borderBottom: "1px solid #e5e5e5",
            background: "#ffffff",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ fontWeight: 600 }}>Mini CRM</div>
          <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
            <Link href="/contacts">Contacts</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/deals">Deals</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/import">Import</Link>
          </nav>
        </header>

        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  );
}
