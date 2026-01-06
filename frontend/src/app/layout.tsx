// // frontend/src/app/layout.tsx
// import "./globals.css";
// import type { Metadata } from "next";
// import Link from "next/link";
//
// export const metadata: Metadata = {
//   title: "Mini CRM",
//   description: "Internal CRM",
// };
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         style={{
//           margin: 0,
//           fontFamily: "system-ui, -apple-system, sans-serif",
//           background: "#f5f5f5",
//         }}
//       >
//         <header
//           style={{
//             borderBottom: "1px solid #e5e5e5",
//             background: "#ffffff",
//             padding: "10px 24px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             position: "sticky",
//             top: 0,
//             zIndex: 10,
//           }}
//         >
//           <div style={{ fontWeight: 600 }}>Mini CRM</div>
//           <nav style={{ display: "flex", gap: 16, fontSize: 14 }}>
//             <Link href="/contacts">Contacts</Link>
//             <Link href="/companies">Companies</Link>
//             <Link href="/deals">Deals</Link>
//             <Link href="/dashboard">Dashboard</Link>
//             <Link href="/import">Import</Link>
//           </nav>
//         </header>
//
//         <main style={{ padding: 24 }}>{children}</main>
//       </body>
//     </html>
//   );
// }
//
// import "./globals.css";
// import Link from "next/link";
//
// export const metadata = {
//   title: "Prospectoo CRM",
//   description: "Prospectoo CRM",
// };
//
// function NavLink({
//   href,
//   label,
// }: {
//   href: string;
//   label: string;
// }) {
//   // Simple active detection without hooks (works fine for now)
//   // If you want true active state, we’ll swap to usePathname() in a client header component.
//   return (
//     <Link className="navLink" href={href}>
//       {label}
//     </Link>
//   );
// }
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <header className="topbar">
//           <div className="topbarInner">
//             <Link href="/" className="brand">
//               <span className="brandMark" />
//               <span className="brandTitle">
//                 Prospectoo <span style={{ color: "var(--primary)" }}>CRM</span>
//               </span>
//               <span className="badge badgePink" style={{ marginLeft: 6 }}>
//                 internal
//               </span>
//             </Link>
//
//             <nav className="nav">
//               <NavLink href="/contacts" label="Contacts" />
//               <NavLink href="/companies" label="Companies" />
//               <NavLink href="/deals" label="Deals" />
//               <NavLink href="/dashboard" label="Dashboard" />
//               <Link className="btn btnPrimary" href="/import">
//                 Import
//               </Link>
//             </nav>
//           </div>
//         </header>
//
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }
//
// // layout.tsx
// import React from "react";
// import Link from "next/link"; // Use Next.js Link for routing
// import "./globals.css";
//
// export const metadata = {
//   title: "Prospectoo CRM",
//   description: "Prospectoo CRM",
// };
//
// function NavLink({
//   href,
//   label,
// }: {
//   href: string;
//   label: string;
// }) {
//   return (
//     <Link href={href} className="navLink">
//       {label}
//     </Link>
//   );
// }
//
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <header className="topbar">
//           <div className="topbarInner">
//             {/* Branding section */}
//             <Link href="/" className="brand">
//               <span className="brandMark" />
//               <span className="brandTitle">
//                 Prospectoo <span style={{ color: "var(--primary)" }}>CRM</span>
//               </span>
//               <span className="badge badgePink" style={{ marginLeft: 6 }}>
//                 internal
//               </span>
//             </Link>
//
//             {/* Navigation links */}
//             <nav className="nav">
//               <NavLink href="/contacts" label="Contacts" />
//               <NavLink href="/companies" label="Companies" />
//               <NavLink href="/deals" label="Deals" />
//               <NavLink href="/dashboard" label="Dashboard" />
//               <Link href="/import" className="btn btnPrimary">
//                 Import
//               </Link>
//             </nav>
//           </div>
//         </header>
//
//         <main>{children}</main>
//       </body>
//     </html>
//   );
// }


// layout.tsx
import React from "react";
import Link from "next/link"; // Use Next.js Link for routing
import "./globals.css";

export const metadata = {
  title: "Prospectoo CRM",
  description: "Prospectoo CRM",
};

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="navLink">
      {label}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="topbarInner">
            {/* Branding section */}
            <Link href="/" className="brand">
              <span className="brandMark" />
              <span className="brandTitle" style={{ color: "#E0155A" }}>
                Prospectoo <span style={{ color: "#E0155A" }}>CRM</span>
              </span>
            </Link>

            {/* Navigation links */}
            <nav className="nav">
              <NavLink href="/contacts" label="Contacts" />
              <NavLink href="/companies" label="Companies" />
              <NavLink href="/dashboard" label="Dashboard" />
              <Link href="/import" className="btn btnPrimary" style={{ display: 'inline-block', padding: '8px 16px', backgroundColor: '#E0155A', color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
                Import
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
