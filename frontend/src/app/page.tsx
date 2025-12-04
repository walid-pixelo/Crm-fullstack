// import Image from "next/image";
//
// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

type Contact = {
  contact_id: number;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company_name: string | null;
  location: string | null;
  connection_degree: string | null;
  duration: string | null;
  status: string | null;
  official_email: string | null;
  email: string | null;
  sales_nav_profile_url: string | null;
};

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [total, setTotal] = useState(0);
  const pageSize = 50; // matches DRF pagination

  async function fetchContacts() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("page_size", String(pageSize));

      if (search.trim()) {
        // DRF SearchFilter
        params.set("search", search.trim());
      }

      if (statusFilter) {
        // filterset_fields in Django view
        params.set("status", statusFilter);
      }

      const url = `${API_BASE_URL}/contacts/?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data: PaginatedResponse<Contact> = await res.json();
      setContacts(data.results || []);
      setTotal(data.count ?? 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  // Fetch when page / filters change
  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // Separate effect for search with small debounce
  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchContacts();
    }, 400);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1 style={{ fontWeight: 600, fontSize: 22, marginBottom: 16 }}>
        Contacts
      </h1>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Search box */}
        <input
          type="text"
          placeholder="Search name, title, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 10px",
            minWidth: 260,
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        />

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setPage(1);
            setStatusFilter(e.target.value);
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
            fontSize: 14,
          }}
        >
          <option value="">All statuses</option>
          <option value="New">New</option>
          <option value="Working">Working</option>
          <option value="Qualified">Qualified</option>
          <option value="Unqualified">Unqualified</option>
        </select>

        <span style={{ fontSize: 13, color: "#666", marginLeft: "auto" }}>
          {loading
            ? "Loading…"
            : `Showing ${contacts.length} of ${total} contacts (page ${page}/${totalPages})`}
        </span>
      </div>

      {/* Error state */}
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 6,
            background: "#ffe6e6",
            color: "#b60000",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Job Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Official Email</th>
              <th style={thStyle}>Sales Nav</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && !loading && (
              <tr>
                <td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#777" }}>
                  No contacts found.
                </td>
              </tr>
            )}

            {contacts.map((c) => (
              <tr key={c.contact_id}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500 }}>
                    {c.full_name ||
                      `${c.first_name || ""} ${c.last_name || ""}`.trim() ||
                      "—"}
                  </div>
                </td>
                <td style={tdStyle}>{c.job_title || "—"}</td>
                <td style={tdStyle}>{c.company_name || "—"}</td>
                <td style={tdStyle}>{c.location || "—"}</td>
                <td style={tdStyle}>{c.status || "—"}</td>
                <td style={tdStyle}>{c.official_email || c.email || "—"}</td>
                <td style={tdStyle}>
                  {c.sales_nav_profile_url ? (
                    <a
                      href={c.sales_nav_profile_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb" }}
                    >
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
          style={buttonStyle}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
          disabled={page >= totalPages || loading}
          style={buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderBottom: "1px solid #f3f3f3",
};

const buttonStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};
